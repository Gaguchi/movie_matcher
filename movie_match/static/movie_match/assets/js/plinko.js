var winningMovieData = null;

class Peg {
    constructor(xCoordinate, yCoordinate) {
        this.x = xCoordinate;
        this.y = yCoordinate;
        this.radius = 5;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = "#000";
        context.fill();
    }
}

class Ball {
    constructor(xCoordinate, yCoordinate, canvas) {
        this.x = xCoordinate;
        this.y = 70;
        this.radius = 5;
        this.vx = 0;
        this.vy = 0;
        this.gravity = .2;
        this.friction = .98;
        this.bounciness = .9;
        this.hitBottom = false;
        this.canvas = canvas;
    }

    update() {
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.radius > this.canvas.height) {
            this.y = this.canvas.height - this.radius;
            this.vy *= -1;
        }
    }

    bounce() {
        this.vx *= this.bounciness;
        this.vy *= -this.bounciness;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = "#f00";
        context.fill();
    }
}

class Plinko {
    constructor(canvasElement, moviesData) {
        console.log("Initializing Plinko game");
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext("2d");
        this.pegs = [];
        this.balls = [];
        this.sections = 5;
        this.movies = moviesData;
        this.logged = false;

        this.createPegs();
        this.sectionWidth = 68;
        this.sectionHeight = 102;
        this.sectionX = 0;
        this.sectionY = 399;
        this.images = [];

        if (Array.isArray(this.movies)) {
            for (let i = 0; i < this.movies.length; i++) {
                const image = new Image();
                image.src = "https://image.tmdb.org/t/p/w500" + this.movies[i].fields.poster_path;
                this.images.push(image);
            }
        }
    }

    drawWalls() {
        for (let i = 0; i < this.sections; i++) {
            if (i < this.images.length && this.images[i].complete) {
                this.ctx.drawImage(
                    this.images[i],
                    this.sectionX + i * this.sectionWidth,
                    this.sectionY,
                    this.sectionWidth,
                    this.sectionHeight
                );
                this.ctx.fillStyle = "rgba(0, 0, 255, 0)";
                this.ctx.fillRect(
                    this.sectionX + i * this.sectionWidth,
                    this.sectionY,
                    this.sectionWidth,
                    this.sectionHeight
                );
            }
        }
    }

    redrawSections(newMoviesData) {
        this.movies = newMoviesData;
        this.images = [];

        for (let i = 0; i < this.movies.length; i++) {
            if (this.movies[i] && this.movies[i].fields) {
                const image = new Image();
                image.src = "https://image.tmdb.org/t/p/w500" + this.movies[i].fields.poster_path;
                image.onload = () => this.drawWalls();
                this.images.push(image);
            }
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawWalls();

        for (let i = 0; i < this.pegs.length; i++) {
            this.pegs[i].draw(this.ctx);
        }

        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].draw(this.ctx);
        }
    }

    updateMoviesData() {
        this.redrawSections();
    }

    createPegs() {
        const numRows = 12;
        const numCols = 11;
        const pegSpacing = 30;
        const xOffset = 0;
        const yOffset = 10;

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                let x = col * pegSpacing + pegSpacing / 2 + xOffset;
                let y = row * pegSpacing + pegSpacing / 2 + yOffset;

                if (row % 2 === 0) {
                    x += pegSpacing / 2;
                }

                this.pegs.push(new Peg(x, y));
            }
        }
    }

    addBall(xCoordinate, yCoordinate) {
        this.balls.push(new Ball(xCoordinate, yCoordinate, this.canvas));
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
                    const sinAngle = Math.sin(angle);
                    const cosAngle = Math.cos(angle);

                    let vx = ball.vx * cosAngle + ball.vy * sinAngle;
                    let vy = ball.vy * cosAngle - ball.vx * sinAngle;

                    vx *= -1;
                    ball.vx = vx * cosAngle - vy * sinAngle;
                    ball.vy = vy * cosAngle + vx * sinAngle;

                    ball.bounce();

                    const overlap = ball.radius + peg.radius - distance;
                    ball.x += overlap * cosAngle;
                    ball.y += overlap * sinAngle;
                }
            }

            if ((ball.x + ball.radius > this.canvas.width || ball.x - ball.radius < 0) && (ball.vx *= -1));

            if (ball.y + ball.radius > this.canvas.height) {
                ball.bounce();
            }

            if (!ball.hitBottom && ball.y + ball.radius > this.canvas.height - 50) {
                const section = Math.floor(ball.x / sectionWidth);
                console.log("Ball in section:", section + 1);
                ball.hitBottom = true;
            }

            for (let s = 1; s < this.sections; s++) {
                if (ball.y + ball.radius > this.canvas.height - 50 && ball.x > s * sectionWidth && ball.x < s * sectionWidth + 10) {
                    ball.vx *= -1;
                }
            }

            for (let i = 0; i < this.balls.length; i++) {
                this.balls[i].update();

                if (this.balls[i].y + this.balls[i].radius >= this.canvas.height) {
                    this.determineWinningSection(this.balls[i]);
                    this.balls.splice(i, 1);
                    i--;
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.pegs.length; i++) {
            this.pegs[i].draw(this.ctx);
        }

        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].draw(this.ctx);
        }

        this.drawWalls();
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    determineWinningSection(ball) {
        if (!ball) {
            console.error("determineWinningSection was called with an undefined ball");
            return;
        }

        const sectionWidth = this.canvas.width / this.sections;
        const sectionIndex = Math.floor(ball.x / sectionWidth);
        const movieData = this.movies[sectionIndex];

        if (movieData) {
            winningMovieData = movieData;
            console.log("Winning section:", sectionIndex);
            console.log("Winning movie:", movieData.fields.title);

            var modalElement = document.getElementById("exampleModalCenter");
            let movieLink = modalElement.querySelector(".movie-link");

            if (movieLink) {
                movieLink.textContent = movieData.fields.title;
                movieLink.href = "../movie_profile/" + movieData.fields.movie_id + "/";
            } else {
                console.error("Error: .movie-link element not found");
            }

            modalElement.querySelector(".lead").textContent = movieData.fields.overview;
            modalElement.querySelector(".text-muted").textContent = movieData.fields.release_date;
            modalElement.querySelector(".modal-image").src = "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + movieData.fields.poster_path;
            modalElement.querySelector(".modal-content").style.background = "url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces" + movieData.fields.backdrop_path + ")";

            var modalInstance = new bootstrap.Modal(modalElement);
            modalInstance.show();
        } else {
            console.error("No movie data for section:", sectionIndex);
        }
    }
}

const canvasElement = document.querySelector("canvas");
const moviesData = []; // Replace this with your actual movies data
const plinkoGame = new Plinko(canvasElement, moviesData);
plinkoGame.loop();

canvasElement.addEventListener("click", event => {
    plinkoGame.addBall(event.clientX, event.clientY);
});
