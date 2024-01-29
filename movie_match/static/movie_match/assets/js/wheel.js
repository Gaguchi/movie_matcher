var imageScale = 0.9;
var imagePosition = 105;
var wheelRotationAngle = 0; 
var isSpinning = false;
var adjustedAngleOffset = 68; 
var winningMovieData = null;

var wheelImages = [];

function loadWheelImages(movieData, callback) {
    var loadedImagesCount = 0;
    movieData.forEach(function (movie, index) {
        var newImage = new Image;
        newImage.onload = function () {
            loadedImagesCount++;
            if (loadedImagesCount === movieData.length) {
                callback();
            }
        };
        newImage.src = "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + movie.fields.poster_path;
        wheelImages.push({
            image: newImage,
            movie: movie
        });
    });
    console.log(movieData);
}

function drawWheel(canvas, rotationAngle) {
    var context = canvas.getContext("2d"),
        numImages = Math.min(wheelImages.length, 8),
        radianAngle = rotationAngle * Math.PI / 180,
        sectionAngle = 2 * Math.PI / numImages,
        outerRadius = canvas.width / 2 - 20,
        innerRadius = 20;
    context.clearRect(0, 0, canvas.width, canvas.height);
    wheelImages.forEach(function (wheelImage, index) {
        var startAngle = radianAngle + index * sectionAngle,
            endAngle = startAngle + sectionAngle;
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, outerRadius, startAngle, endAngle, false);
        context.arc(canvas.width / 2, canvas.height / 2, innerRadius, endAngle, startAngle, true);
        context.closePath();
        context.fillStyle = index % 2 == 0 ? "#eeeeee" : "#dbdbdb";
        context.shadowColor = "rgba(0, 0, 0, 0.5)";
        context.shadowBlur = 3;
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 1;
        context.fill();
        context.save();
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, outerRadius, startAngle, endAngle, false);
        context.arc(canvas.width / 2, canvas.height / 2, innerRadius, endAngle, startAngle, true);
        context.closePath();
        context.clip();
        var scale = Math.min((outerRadius - innerRadius) / wheelImage.image.width, (outerRadius - innerRadius) / wheelImage.image.height);
        scale *= imageScale;
        var imageWidth = scale * wheelImage.image.width,
            imageHeight = scale * wheelImage.image.height,
            imageX = canvas.width / 2 + Math.cos(startAngle + sectionAngle / 2) * (innerRadius + imagePosition),
            imageY = canvas.height / 2 + Math.sin(startAngle + sectionAngle / 2) * (innerRadius + imagePosition);
        context.translate(imageX, imageY);
        context.rotate(startAngle + sectionAngle / 2 + Math.PI / 2);
        context.drawImage(wheelImage.image, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
        context.restore();
    });
    drawCenterButton(canvas);
    drawIndicator(canvas);
}

function drawIndicator(canvas) {
    var context = canvas.getContext("2d");
    context.shadowColor = "rgba(0, 0, 0, 0.5)";
    context.shadowBlur = 3;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 1;
    context.fillStyle = "#dab694";
    context.beginPath();
    context.moveTo(canvas.width / 2 - 20, 5);
    context.lineTo(canvas.width / 2 + 20, 5);
    context.lineTo(canvas.width / 2, 40);
    context.closePath();
    context.fill();
    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
}

function drawCenterButton(canvas) {
    var context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.shadowColor = "rgba(0, 0, 0, 0.5)";
    context.shadowBlur = 3;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 1;
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, 30, 0, 2 * Math.PI, false);
    context.fill();
    context.fillStyle = "#dab694";
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, 25, 0, 2 * Math.PI, false);
    context.fill();
    context.fillStyle = "white";
    context.font = "bold 20px sans-serif";
    context.fillText("Spin", canvas.width / 2 - context.measureText("Spin").width / 2, canvas.height / 2 + 6);
}

function calculateWinner(rotationAngle, numImages, movieData) {
    var normalizedAngle = rotationAngle % 360;
    if (normalizedAngle < 0) {
        normalizedAngle += 360;
    }

    var adjustedAngle = (normalizedAngle + adjustedAngleOffset + 360 / numImages / 2) % 360;
    if (adjustedAngle < 0) {
        adjustedAngle += 360;
    }

    var winningIndex = Math.floor(numImages * (1 - adjustedAngle / 360));

    if (winningIndex >= 0 && winningIndex < movieData.length) {
        var winningMovie = movieData[winningIndex];
        console.log("Winning Movie:", winningMovie.fields.title);
        winningMovieData = winningMovie;

        var modalElement = document.getElementById("exampleModalCenter");
        let movieLinkElement = modalElement.querySelector(".movie-link");

        if (movieLinkElement) {
            movieLinkElement.textContent = winningMovie.fields.title;
            movieLinkElement.href = "../movie_profile/" + winningMovie.fields.movie_id + "/";
        } else {
            console.error("Error: .movie-link element not found");
        }

        modalElement.querySelector(".lead").textContent = winningMovie.fields.overview;
        modalElement.querySelector(".text-muted").textContent = winningMovie.fields.release_date;
        modalElement.querySelector(".modal-image").src = "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + winningMovie.fields.poster_path;
        modalElement.querySelector(".modal-content").style.background = "url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces" + winningMovie.fields.backdrop_path + ")";

        var modal = new bootstrap.Modal(modalElement);
        modal.show();
    } else {
        console.error("Invalid Winning Index:", winningIndex);
    }
}

function spinWheel(canvas) {
    if (!isSpinning) {
        isSpinning = true;
        var moviesDataElement = document.getElementById("movies-data");
        if (moviesDataElement) {
            var moviesData = JSON.parse(moviesDataElement.textContent),
                numImages = Math.min(moviesData.length, 8),
                finalRotationAngle = wheelRotationAngle + 360 * Math.random() + 1800;
            wheelRotationAngle = finalRotationAngle % 360;
            var currentRotationAngle = wheelRotationAngle,
                spinInterval = setInterval(function () {
                    currentRotationAngle += 0.1 * (finalRotationAngle - currentRotationAngle);
                    drawWheel(canvas, currentRotationAngle);
                    if (Math.abs(finalRotationAngle - currentRotationAngle) < 0.5) {
                        clearInterval(spinInterval);
                        isSpinning = false;
                        calculateWinner(currentRotationAngle, numImages, moviesData);
                    }
                }, 16);
        } else {
            console.error("Movies data element not found");
        }
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
    var canvasElement = document.getElementById("movieWheelCanvas");
    if (canvasElement) {
        var moviesDataElement = document.getElementById("movies-data");
        if (moviesDataElement) {
            var moviesData = JSON.parse(moviesDataElement.textContent);
            loadWheelImages(moviesData, function () {
                drawWheel(canvasElement, 0)
            })
        } else console.error("Movies data element not found")
    } else console.error("Canvas element not found")
};