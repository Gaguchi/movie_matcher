
var winningMovieData = null;

class Peg {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
    }
}

class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = 70;
        this.radius = 5;
        this.vx = 0;
        this.vy = 0;
        this.gravity = 0.2;  // Increase gravity
        this.friction = 0.98;  // Increase friction
        this.bounciness = 0.9;  // Decrease bounciness
        this.hitBottom = false;  // Add this line
    }

    update() {
        this.vy += this.gravity;
        this.vx *= this.friction;  // Apply friction
        this.vy *= this.friction;  // Apply friction
        this.x += this.vx;
        this.y += this.vy;
        
        // Prevent the ball from going below the bottom of the canvas
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy *= -1;
        }
    }

    bounce() {
        this.vx *= this.bounciness;  // Apply bounciness
        this.vy *= -this.bounciness;  // Apply bounciness
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f00';
        ctx.fill();
    }
}

class Plinko {
    constructor(canvas, movies) {  // Add movies parameter here
        console.log('Initializing Plinko game');  // Debugging log
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.pegs = [];
        this.balls = [];
        this.sections = 5;  // Number of sections
        this.movies = movies;  // Add this line
        this.logged = false;  // Add this line
        this.createPegs();
        this.sectionWidth = 68 ;  // Initial section width
        this.sectionHeight = 102 ;  // Initial section height
        this.sectionX = 0;  // Initial x position
        this.sectionY = 399;  // Initial y position

        // Load the image
        this.images = [];
        if (Array.isArray(this.movies)) {
            for (let i = 0; i < this.movies.length; i++) {
                const img = new Image();
                img.src = 'https://image.tmdb.org/t/p/w500' + this.movies[i].fields.poster_path;
                this.images.push(img);
            }
        }
    }

    drawWalls() {
        // Draw the images
        for (let i = 0; i < this.sections; i++) {
            // Check if an image exists and has loaded
            if (i < this.images.length && this.images[i].complete) {
                // Draw the image in the section
                this.ctx.drawImage(this.images[i], this.sectionX + i * this.sectionWidth, this.sectionY, this.sectionWidth, this.sectionHeight);

                // Draw a semi-transparent rectangle on top of the image
                this.ctx.fillStyle = 'rgba(0, 0, 255, 0)';  // Semi-transparent blue
                this.ctx.fillRect(this.sectionX + i * this.sectionWidth, this.sectionY, this.sectionWidth, this.sectionHeight);
            }
        }
    }
    
    redrawSections(newMovies) {
        // Update the movies
        this.movies = newMovies;

        // Update the images
        this.images = [];
        for (let i = 0; i < this.movies.length; i++) {
            // Check if the movie object and its fields property are defined
            if (this.movies[i] && this.movies[i].fields) {
                const img = new Image();
                img.src = 'https://image.tmdb.org/t/p/w500' + this.movies[i].fields.poster_path;
                img.onload = () => this.drawWalls();  // Redraw the sections when the image has loaded
                this.images.push(img);
            }
        }

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Redraw the sections
        this.drawWalls();

        // Redraw the pegs
        for (let i = 0; i < this.pegs.length; i++) {
            this.pegs[i].draw(this.ctx);
        }

        // Redraw the balls
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].draw(this.ctx);
        }
    }

    updateMoviesData() {
        this.redrawSections();
    }

    createPegs() {
        const rows = 12;
        const cols = 11;
        const spacing = 30;
        const offsetX = 0;  // Add an offset to the x position of the pegs
        const offsetY = 10;  // Add an offset to the y position of the pegs
    
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let x = col * spacing + spacing / 2 + offsetX;  // Add the offset here
                let y = row * spacing + spacing / 2 + offsetY;  // Add the offset here
                if (row % 2 === 0) {
                    x += spacing / 2;
                }
                this.pegs.push(new Peg(x, y));
            }
        }
    }

    addBall(x, y) {
        this.balls.push(new Ball(x, y));
    }

    update() {
        const sectionWidth = this.canvas.width / this.sections;
    

        for (const ball of this.balls) {
            ball.update();

            for (const peg of this.pegs) {
                const dx = ball.x - peg.x;
                const dy = ball.y - peg.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < ball.radius + peg.radius) {
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);

                    // Rotate the ball's velocity to bounce it off the peg
                    let vx1 = ball.vx * cos + ball.vy * sin;
                    let vy1 = ball.vy * cos - ball.vx * sin;

                    vx1 *= -1;  // Bounce the ball in the x direction

                    // Rotate the ball's velocity back
                    ball.vx = vx1 * cos - vy1 * sin;
                    ball.vy = vy1 * cos + vx1 * sin;

                    ball.bounce();  // Apply bounciness

                    // Move the ball outside the peg
                    const overlap = ball.radius + peg.radius - distance;
                    ball.x += overlap * cos;
                    ball.y += overlap * sin;
                }
            }

            if (ball.x + ball.radius > this.canvas.width || ball.x - ball.radius < 0) {
                ball.vx *= -1;
            }

            if (ball.y + ball.radius > this.canvas.height) {
                ball.bounce();  // Make the ball bounce
            }

            // Check if the ball has reached the bottom of the canvas
            if (!ball.hitBottom && ball.y + ball.radius > this.canvas.height - 50) {
                // Calculate which section the ball is in
                const section = Math.floor(ball.x / sectionWidth);
    
                // Log the section number to the console
                console.log('Ball in section:', section + 1);
    
                // Mark the ball as having hit the bottom
                ball.hitBottom = true;
            }
            // Check collision with lines
            for (let i = 1; i < this.sections; i++) {
                if (ball.y + ball.radius > this.canvas.height - 50 && ball.x > i * sectionWidth && ball.x < (i * sectionWidth + 10)) {
                    ball.vx *= -1;
                }
            }
            // Update the balls
            for (let i = 0; i < this.balls.length; i++) {
                this.balls[i].update();
        
                // Check if the ball has reached the bottom of the canvas
                if (this.balls[i].y + this.balls[i].radius >= this.canvas.height) {
                    // Determine the winning section
                    this.determineWinningSection(this.balls[i]);
        
                    // Remove the ball from the array
                    this.balls.splice(i, 1);
        
                    // Decrement i to account for the removed ball
                    i--;
                }
            }
        }
    }

    draw() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the pegs
        for (let i = 0; i < this.pegs.length; i++) {
            this.pegs[i].draw(this.ctx);
        }

        // Draw the balls
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].draw(this.ctx);
        }

        // Draw the walls
        this.drawWalls();  // Move this line to the end
    }
    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    determineWinningSection(ball) {
        // Check if the ball is undefined
        if (!ball) {
            console.error('determineWinningSection was called with an undefined ball');
            return;
        }

        // Determine the winning section
        const sectionWidth = this.canvas.width / this.sections;
        const winningSection = Math.floor(ball.x / sectionWidth);

        // Get the winning movie
        const winningMovie = this.movies[winningSection];

        // Check if the winning movie is defined
        if (winningMovie) {
            winningMovieData = winningMovie

            // Log the winning section and movie
            console.log('Winning section:', winningSection);
            console.log('Winning movie:', winningMovie.fields.title);
            var modal = document.getElementById('exampleModalCenter');
            modal.querySelector('.modal-title').textContent = winningMovie.fields.title;
            modal.querySelector('.lead').textContent = winningMovie.fields.overview;
            modal.querySelector('.text-muted').textContent = winningMovie.fields.release_date;
            modal.querySelector('.modal-image').src = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + winningMovie.fields.poster_path;
            modal.querySelector('.modal-content').style.background = 'url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces' + winningMovie.fields.backdrop_path +')';
            modal.querySelector('.movie-link').href = 'movie_match/movie_profile' + winningMovie.fields.id;
            var modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        } else {
            console.error('No movie data for section:', winningSection);
        }
    }
}

const canvas = document.querySelector('canvas');
const plinko = new Plinko(canvas);
plinko.loop();

canvas.addEventListener('click', (event) => {
    plinko.addBall(event.clientX, event.clientY);
});