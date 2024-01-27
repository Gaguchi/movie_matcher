var winningMovieData = null;
class Peg {
    constructor(t, i) {
        this.x = t, this.y = i, this.radius = 5
    }
    draw(t) {
        t.beginPath(), t.arc(this.x, this.y, this.radius, 0, 2 * Math.PI), t.fillStyle = "#000", t.fill()
    }
}
class Ball {
    constructor(t, i) {
        this.x = t, this.y = 70, this.radius = 5, this.vx = 0, this.vy = 0, this.gravity = .2, this.friction = .98, this.bounciness = .9, this.hitBottom = !1
    }
    update() {
        this.vy += this.gravity, this.vx *= this.friction, this.vy *= this.friction, this.x += this.vx, this.y += this.vy, this.y + this.radius > canvas.height && (this.y = canvas.height - this.radius, this.vy *= -1)
    }
    bounce() {
        this.vx *= this.bounciness, this.vy *= -this.bounciness
    }
    draw(t) {
        t.beginPath(), t.arc(this.x, this.y, this.radius, 0, 2 * Math.PI), t.fillStyle = "#f00", t.fill()
    }
}
class Plinko {
    constructor(t, i) {
        if (console.log("Initializing Plinko game"), this.canvas = t, this.ctx = t.getContext("2d"), this.pegs = [], this.balls = [], this.sections = 5, this.movies = i, this.logged = !1, this.createPegs(), this.sectionWidth = 68, this.sectionHeight = 102, this.sectionX = 0, this.sectionY = 399, this.images = [], Array.isArray(this.movies))
            for (let t = 0; t < this.movies.length; t++) {
                const i = new Image;
                i.src = "https://image.tmdb.org/t/p/w500" + this.movies[t].fields.poster_path, this.images.push(i)
            }
    }
    drawWalls() {
        for (let t = 0; t < this.sections; t++) t < this.images.length && this.images[t].complete && (this.ctx.drawImage(this.images[t], this.sectionX + t * this.sectionWidth, this.sectionY, this.sectionWidth, this.sectionHeight), this.ctx.fillStyle = "rgba(0, 0, 255, 0)", this.ctx.fillRect(this.sectionX + t * this.sectionWidth, this.sectionY, this.sectionWidth, this.sectionHeight))
    }
    redrawSections(t) {
        this.movies = t, this.images = [];
        for (let t = 0; t < this.movies.length; t++)
            if (this.movies[t] && this.movies[t].fields) {
                const i = new Image;
                i.src = "https://image.tmdb.org/t/p/w500" + this.movies[t].fields.poster_path, i.onload = (() => this.drawWalls()), this.images.push(i)
            } this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height), this.drawWalls();
        for (let t = 0; t < this.pegs.length; t++) this.pegs[t].draw(this.ctx);
        for (let t = 0; t < this.balls.length; t++) this.balls[t].draw(this.ctx)
    }
    updateMoviesData() {
        this.redrawSections()
    }
    createPegs() {
        const t = 12,
            i = 11,
            s = 30,
            e = 0,
            h = 10;
        for (let a = 0; a < t; a++)
            for (let t = 0; t < i; t++) {
                let i = t * s + s / 2 + e,
                    o = a * s + s / 2 + h;
                a % 2 == 0 && (i += s / 2), this.pegs.push(new Peg(i, o))
            }
    }
    addBall(t, i) {
        this.balls.push(new Ball(t, i))
    }
    update() {
        const t = this.canvas.width / this.sections;
        for (const i of this.balls) {
            i.update();
            for (const t of this.pegs) {
                const s = i.x - t.x,
                    e = i.y - t.y,
                    h = Math.sqrt(s * s + e * e);
                if (h < i.radius + t.radius) {
                    const a = Math.atan2(e, s),
                        o = Math.sin(a),
                        n = Math.cos(a);
                    let l = i.vx * n + i.vy * o,
                        r = i.vy * n - i.vx * o;
                    l *= -1, i.vx = l * n - r * o, i.vy = r * n + l * o, i.bounce();
                    const c = i.radius + t.radius - h;
                    i.x += c * n, i.y += c * o
                }
            }
            if ((i.x + i.radius > this.canvas.width || i.x - i.radius < 0) && (i.vx *= -1), i.y + i.radius > this.canvas.height && i.bounce(), !i.hitBottom && i.y + i.radius > this.canvas.height - 50) {
                const s = Math.floor(i.x / t);
                console.log("Ball in section:", s + 1), i.hitBottom = !0
            }
            for (let s = 1; s < this.sections; s++) i.y + i.radius > this.canvas.height - 50 && i.x > s * t && i.x < s * t + 10 && (i.vx *= -1);
            for (let t = 0; t < this.balls.length; t++) this.balls[t].update(), this.balls[t].y + this.balls[t].radius >= this.canvas.height && (this.determineWinningSection(this.balls[t]), this.balls.splice(t, 1), t--)
        }
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let t = 0; t < this.pegs.length; t++) this.pegs[t].draw(this.ctx);
        for (let t = 0; t < this.balls.length; t++) this.balls[t].draw(this.ctx);
        this.drawWalls()
    }
    loop() {
        this.update(), this.draw(), requestAnimationFrame(() => this.loop())
    }
    determineWinningSection(t) {
        if (!t) return void console.error("determineWinningSection was called with an undefined ball");
        const i = this.canvas.width / this.sections,
            s = Math.floor(t.x / i),
            e = this.movies[s];
        if (e) {
            winningMovieData = e, console.log("Winning section:", s), console.log("Winning movie:", e.fields.title);
            var h = document.getElementById("exampleModalCenter");
            let t = h.querySelector(".movie-link");
            t ? (t.textContent = e.fields.title, t.href = "../movie_profile/" + e.fields.movie_id + "/") : console.error("Error: .movie-link element not found"), h.querySelector(".lead").textContent = e.fields.overview, h.querySelector(".text-muted").textContent = e.fields.release_date, h.querySelector(".modal-image").src = "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + e.fields.poster_path, h.querySelector(".modal-content").style.background = "url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces" + e.fields.backdrop_path + ")";
            var a = new bootstrap.Modal(h);
            a.show()
        } else console.error("No movie data for section:", s)
    }
}
const canvas = document.querySelector("canvas"),
    plinko = new Plinko(canvas);
plinko.loop(), canvas.addEventListener("click", t => {
    plinko.addBall(t.clientX, t.clientY)
});