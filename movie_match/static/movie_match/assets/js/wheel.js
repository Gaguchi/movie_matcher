var imageScale = 0.9;
var imagePosition = 105;
var wheelRotationAngle = 0; 
var isSpinning = false;
var adjustedAngleOffset = 68; 
var winningMovieData = null;

var wheelImages = [];

function loadWheelImages(e, t) {
    var a = 0;
    e.forEach(function (n, o) {
        var i = new Image;
        i.onload = function () {
            a++, a === e.length && t()
        }, i.src = "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + n.fields.poster_path, wheelImages.push({
            image: i,
            movie: n
        })
    }), console.log(e)
}

function drawWheel(e, t) {
    var a = e.getContext("2d"),
        n = Math.min(wheelImages.length, 8),
        o = t * Math.PI / 180,
        i = 2 * Math.PI / n,
        l = e.width / 2 - 20,
        r = 20;
    a.clearRect(0, 0, e.width, e.height), wheelImages.forEach(function (t, n) {
        var h = o + n * i,
            d = h + i;
        a.beginPath(), a.arc(e.width / 2, e.height / 2, l, h, d, !1), a.arc(e.width / 2, e.height / 2, r, d, h, !0), a.closePath(), a.fillStyle = n % 2 == 0 ? "#eeeeee" : "#dbdbdb", a.shadowColor = "rgba(0, 0, 0, 0.5)", a.shadowBlur = 3, a.shadowOffsetX = 2, a.shadowOffsetY = 1, a.fill(), a.save(), a.beginPath(), a.arc(e.width / 2, e.height / 2, l, h, d, !1), a.arc(e.width / 2, e.height / 2, r, d, h, !0), a.closePath(), a.clip();
        var s = Math.min((l - r) / t.image.width, (l - r) / t.image.height);
        s *= imageScale;
        var g = s * t.image.width,
            f = s * t.image.height,
            w = e.width / 2 + Math.cos(h + i / 2) * (r + imagePosition),
            c = e.height / 2 + Math.sin(h + i / 2) * (r + imagePosition);
        a.translate(w, c), a.rotate(h + i / 2 + Math.PI / 2), a.drawImage(t.image, -g / 2, -f / 2, g, f), a.restore()
    }), drawCenterButton(e), drawIndicator(e)
}

function drawIndicator(e) {
    var t = e.getContext("2d");
    t.shadowColor = "rgba(0, 0, 0, 0.5)", t.shadowBlur = 3, t.shadowOffsetX = 2, t.shadowOffsetY = 1, t.fillStyle = "#dab694", t.beginPath(), t.moveTo(e.width / 2 - 20, 5), t.lineTo(e.width / 2 + 20, 5), t.lineTo(e.width / 2, 40), t.closePath(), t.fill(), t.shadowColor = "transparent", t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0
}

function drawCenterButton(e) {
    var t = e.getContext("2d");
    t.fillStyle = "white", t.shadowColor = "rgba(0, 0, 0, 0.5)", t.shadowBlur = 3, t.shadowOffsetX = 2, t.shadowOffsetY = 1, t.beginPath(), t.arc(e.width / 2, e.height / 2, 30, 0, 2 * Math.PI, !1), t.fill(), t.fillStyle = "#dab694", t.beginPath(), t.arc(e.width / 2, e.height / 2, 25, 0, 2 * Math.PI, !1), t.fill(), t.fillStyle = "white", t.font = "bold 20px sans-serif", t.fillText("Spin", e.width / 2 - t.measureText("Spin").width / 2, e.height / 2 + 6)
}

function calculateWinner(e, t, a) {
    var n = e % 360;
    n < 0 && (n += 360);
    var o = (n + adjustedAngleOffset + 360 / t / 2) % 360;
    o < 0 && (o += 360);
    var i = Math.floor(t * (1 - o / 360));
    if (i >= 0 && i < a.length) {
        var l = a[i];
        console.log("Winning Movie:", l.fields.title), winningMovieData = l;
        var r = document.getElementById("exampleModalCenter");
        let e = r.querySelector(".movie-link");
        e ? (e.textContent = l.fields.title, e.href = "../movie_profile/" + l.fields.movie_id + "/") : console.error("Error: .movie-link element not found"), r.querySelector(".lead").textContent = l.fields.overview, r.querySelector(".text-muted").textContent = l.fields.release_date, r.querySelector(".modal-image").src = "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + l.fields.poster_path, r.querySelector(".modal-content").style.background = "url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces" + l.fields.backdrop_path + ")";
        var h = new bootstrap.Modal(r);
        h.show()
    } else console.error("Invalid Winning Index:", i)
}

function spinWheel(e) {
    if (!isSpinning) {
        isSpinning = !0;
        var t = document.getElementById("movies-data");
        if (t) {
            var a = JSON.parse(t.textContent),
                n = Math.min(a.length, 8),
                o = wheelRotationAngle + 360 * Math.random() + 1800;
            wheelRotationAngle = o % 360;
            var i = wheelRotationAngle,
                l = setInterval(function () {
                    i += .1 * (o - i), drawWheel(e, i), Math.abs(o - i) < .5 && (clearInterval(l), isSpinning = !1, calculateWinner(i, n, a))
                }, 16)
        } else console.error("Movies data element not found")
    }
}
var imageScale = .9,
    imagePosition = 105,
    wheelRotationAngle = 0,
    isSpinning = !1,
    adjustedAngleOffset = 68,
    winningMovieData = null,
    wheelImages = [];
window.onload = function () {
    var e = document.getElementById("movieWheelCanvas");
    if (e) {
        var t = document.getElementById("movies-data");
        if (t) {
            var a = JSON.parse(t.textContent);
            loadWheelImages(a, function () {
                drawWheel(e, 0)
            })
        } else console.error("Movies data element not found")
    } else console.error("Canvas element not found")
};