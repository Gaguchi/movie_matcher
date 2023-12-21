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
        this.y = y;
        this.radius = 10;
        this.vx = 0;
        this.vy = 0;
        this.gravity = 0.2;  // Increase gravity
        this.friction = 0.98;  // Increase friction
        this.bounciness = 0.9;  // Decrease bounciness
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
    constructor(canvas) {
        console.log('Initializing Plinko game');  // Debugging log
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.pegs = [];
        this.balls = [];
        this.createPegs();
    }

    createPegs() {
        const rows = 10;
        const cols = 7;
        const spacing = 50;
        const offsetX = 10;  // Add an offset to the x position of the pegs

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let x = col * spacing + spacing / 2 + offsetX;  // Add the offset here
                const y = row * spacing + spacing / 2;
                if (row % 2 === 0) {
                    x += spacing / 2;
                }
                this.pegs.push(new Peg(x, y));
            }
        }
    }

    addBall(x, y) {
        console.log(`Adding ball at position (${x}, ${y})`);  // Debugging log
        this.balls.push(new Ball(x, y));
    }

    update() {
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
        }
    }

    draw() {
        console.log(`Drawing ${this.pegs.length} pegs and ${this.balls.length} balls`);  // Debugging log
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const peg of this.pegs) {
            peg.draw(this.ctx);
        }

        for (const ball of this.balls) {
            ball.draw(this.ctx);
        }
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

const canvas = document.querySelector('canvas');
const plinko = new Plinko(canvas);
plinko.loop();

canvas.addEventListener('click', (event) => {
    plinko.addBall(event.clientX, event.clientY);
});