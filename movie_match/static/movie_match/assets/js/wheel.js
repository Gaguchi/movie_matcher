var imageScale = 0.9;
var imagePosition = 105;
var wheelRotationAngle = 0; // Global rotation angle for the wheel
var isSpinning = false;
var adjustedAngleOffset = 68; // Initial offset value
var winningMovieData = null;

// Preloaded images and their state
var wheelImages = [];

// Function to preload images for the wheel
function loadWheelImages(movies, callback) {
    var loadedCount = 0;
    movies.forEach(function(movie, index) {
        var image = new Image();
        image.onload = function() {
            loadedCount++;
            if (loadedCount === movies.length) {
                callback(); // Call drawWheel when all images are loaded
            }
        };
        image.src = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + movie.fields.poster_path;
        wheelImages.push({ image: image, movie: movie });
    });
    console.log(movies)
}


// Function to draw the wheel with movies
function drawWheel(canvas, rotationAngle) {
    var ctx = canvas.getContext('2d');
    var numberOfSegments = Math.min(wheelImages.length, 8);
    var angle = rotationAngle * Math.PI / 180;
    var arc = Math.PI * 2 / numberOfSegments;
    var outsideRadius = canvas.width / 2 - 20;
    var insideRadius = 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    wheelImages.forEach(function(wheelImage, index) {
        var angleStart = angle + index * arc;
        var angleEnd = angleStart + arc;

        // Draw segment
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, outsideRadius, angleStart, angleEnd, false);
        ctx.arc(canvas.width / 2, canvas.height / 2, insideRadius, angleEnd, angleStart, true);
        ctx.closePath();

        // Alternate colors between grey and dark grey
        ctx.fillStyle = index % 2 === 0 ? '#eeeeee' : '#dbdbdb'; // '#808080' is grey, '#404040' is dark grey
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Shadow color
        ctx.shadowBlur = 3; // Blur level
        ctx.shadowOffsetX = 2; // Horizontal offset
        ctx.shadowOffsetY = 1; // Vertical offset
        ctx.fill();

        // Draw image
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, outsideRadius, angleStart, angleEnd, false);
        ctx.arc(canvas.width / 2, canvas.height / 2, insideRadius, angleEnd, angleStart, true);
        ctx.closePath();
        ctx.clip();

        var scale = Math.min((outsideRadius - insideRadius) / wheelImage.image.width, (outsideRadius - insideRadius) / wheelImage.image.height);
        scale *= imageScale; // Apply the scale from the variable
        var scaledWidth = scale * wheelImage.image.width;
        var scaledHeight = scale * wheelImage.image.height;

        var imageX = canvas.width / 2 + Math.cos(angleStart + arc / 2) * (insideRadius + imagePosition);
        var imageY = canvas.height / 2 + Math.sin(angleStart + arc / 2) * (insideRadius + imagePosition);

        ctx.translate(imageX, imageY);
        ctx.rotate(angleStart + arc / 2 + Math.PI / 2);
        ctx.drawImage(wheelImage.image, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
        ctx.restore();
    });

    drawCenterButton(canvas);
    drawIndicator(canvas);
}



// Function to draw the indicator (static)
function drawIndicator(canvas) {
    var ctx = canvas.getContext('2d');

    // Set shadow properties
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Shadow color
    ctx.shadowBlur = 3; // Blur level
    ctx.shadowOffsetX = 2; // Horizontal offset
    ctx.shadowOffsetY = 1; // Vertical offset

    // Draw the indicator with shadow
    ctx.fillStyle = '#dab694';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 20, 5);
    ctx.lineTo(canvas.width / 2 + 20, 5);
    ctx.lineTo(canvas.width / 2, 40);
    ctx.closePath();
    ctx.fill();

    // Reset shadow properties to avoid affecting other elements
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}


// Function to draw the center button (static)
function drawCenterButton(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Shadow color
    ctx.shadowBlur = 3; // Blur level
    ctx.shadowOffsetX = 2; // Horizontal offset
    ctx.shadowOffsetY = 1; // Vertical offset
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.fillStyle = '#dab694';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 25, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Spin', canvas.width / 2 - ctx.measureText('Spin').width / 2, canvas.height / 2 + 6);
}

// Function to determine and log the winning movie
function calculateWinner(angle, numberOfSegments, movies) {
    var finalAngle = angle % 360;
    if (finalAngle < 0) finalAngle += 360;

    var adjustedAngle = (finalAngle + adjustedAngleOffset + (360 / numberOfSegments / 2)) % 360;
    if (adjustedAngle < 0) adjustedAngle += 360;

    var winningIndex = Math.floor(numberOfSegments * (1 - adjustedAngle / 360));

    if (winningIndex >= 0 && winningIndex < movies.length) {
        var winningMovie = movies[winningIndex];
        console.log('Winning Movie:', winningMovie.fields.title);
        winningMovieData = winningMovie;

        // Update and show the modal with winning movie details
        var modal = document.getElementById('exampleModalCenter');
        modal.querySelector('.modal-title').textContent = winningMovie.fields.title;
        modal.querySelector('.lead').textContent = winningMovie.fields.overview;
        modal.querySelector('.modal-image').src = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + winningMovie.fields.poster_path;
        var modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    } else {
        console.error('Invalid Winning Index:', winningIndex);
    }
}


// Function to spin the wheel
function spinWheel(canvas) {
    if (isSpinning) {
        return; // Prevent additional spins if the wheel is already spinning
    }

    isSpinning = true; // Set the flag to indicate the wheel is spinning

    var moviesElement = document.getElementById('movies-data');
    if (!moviesElement) {
        console.error('Movies data element not found');
        return;
    }
    var movies = JSON.parse(moviesElement.textContent);

    var numberOfSegments = Math.min(movies.length, 8);
    var newAngle = wheelRotationAngle + Math.random() * 360 + 360 * 5;
    wheelRotationAngle = newAngle % 360;

    var currentAngle = wheelRotationAngle;
    var interval = setInterval(function() {
        currentAngle += (newAngle - currentAngle) * 0.1;
        drawWheel(canvas, currentAngle);

        if (Math.abs(newAngle - currentAngle) < 0.5) {
            clearInterval(interval);
            isSpinning = false;

            calculateWinner(currentAngle, numberOfSegments, movies);
        }
    }, 16);
}

// Initial setup and image loading
window.onload = function() {
    var canvas = document.getElementById('movieWheelCanvas');
    if (canvas) {
        var moviesElement = document.getElementById('movies-data');
        if (moviesElement) {
            var movies = JSON.parse(moviesElement.textContent);
            loadWheelImages(movies, function() {
                drawWheel(canvas, 0); // Draw initial wheel
            });
        } else {
            console.error('Movies data element not found');
        }
    } else {
        console.error('Canvas element not found');
    }
};