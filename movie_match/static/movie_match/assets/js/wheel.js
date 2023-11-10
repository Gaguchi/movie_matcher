var imageScale = 0.9;
var imagePosition = 100;
var wheelRotationAngle = 0; // Global rotation angle for the wheel

// Function to draw the wheel with movies
function drawWheel(canvas, rotationAngle) {
    var ctx = canvas.getContext('2d');
    var moviesElement = document.getElementById('movies-data');

    if (!moviesElement) {
        console.error('Movies data element not found');
        return;
    }

    var movies = JSON.parse(moviesElement.textContent);

    if (!Array.isArray(movies)) {
        console.error('Invalid movies data:', movies);
        return;
    }

    var numberOfSegments = Math.min(movies.length, 8);
    var angle = rotationAngle * Math.PI / 180;
    var arc = Math.PI * 2 / numberOfSegments;
    var outsideRadius = canvas.width / 2 - 20;
    var insideRadius = 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movies.forEach(function(movie, index) {
        var angleStart = angle + index * arc;
        var angleEnd = angleStart + arc;

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, outsideRadius, angleStart, angleEnd, false);
        ctx.arc(canvas.width / 2, canvas.height / 2, insideRadius, angleEnd, angleStart, true);
        ctx.closePath();
        ctx.fillStyle = 'hsl(' + (index * 360 / numberOfSegments) + ', 100%, 50%)';
        ctx.fill();

        var image = new Image();
        image.onload = function() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, outsideRadius, angleStart, angleEnd, false);
            ctx.arc(canvas.width / 2, canvas.height / 2, insideRadius, angleEnd, angleStart, true);
            ctx.closePath();
            ctx.clip();

            var scale = Math.min((outsideRadius - insideRadius) / image.width, (outsideRadius - insideRadius) / image.height);
            scale *= imageScale; // Apply the scale from the variable
            var scaledWidth = scale * image.width;
            var scaledHeight = scale * image.height;

            var imageX = canvas.width / 2 + Math.cos(angleStart + arc / 2) * (insideRadius + imagePosition);
            var imageY = canvas.height / 2 + Math.sin(angleStart + arc / 2) * (insideRadius + imagePosition);

            ctx.translate(imageX, imageY);
            ctx.rotate(angleStart + arc / 2 + Math.PI / 2);
            ctx.drawImage(image, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
            ctx.restore();
        };
        image.src = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + movie.fields.poster_path;
    });

    drawCenterButton(canvas);
    drawIndicator(canvas);
}

// Function to draw the indicator (static)
function drawIndicator(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 10, 0);
    ctx.lineTo(canvas.width / 2 + 10, 0);
    ctx.lineTo(canvas.width / 2, 30);
    ctx.fill();
}

// Function to draw the center button (static)
function drawCenterButton(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Spin', canvas.width / 2 - ctx.measureText('Spin').width / 2, canvas.height / 2 + 10);
}

// Function to spin the wheel
function spinWheel(canvas) {
    var ctx = canvas.getContext('2d');

    var newAngle = wheelRotationAngle + Math.random() * 360 + 360 * 5;
    wheelRotationAngle = newAngle % 360;

    var currentAngle = wheelRotationAngle;
    var interval = setInterval(function() {
        currentAngle += (newAngle - currentAngle) * 0.1;
        drawWheel(canvas, currentAngle);
        if (Math.abs(newAngle - currentAngle) < 0.5) {
            clearInterval(interval);
        }
    }, 16);
}

// Event listener for the wheel
document.getElementById('movieWheelCanvas').addEventListener('click', function() {
    var canvas = document.getElementById('movieWheelCanvas');
    spinWheel(canvas);
});

// Initial setup to draw static parts of the wheel
window.onload = function() {
    var canvas = document.getElementById('movieWheelCanvas');
    if (canvas) {
        drawCenterButton(canvas);
        drawIndicator(canvas);
        drawWheel(canvas, 0); // Draw initial wheel
    } else {
        console.error('Canvas element not found');
    }
};

// ... [Any additional code or event listeners for sliders]
