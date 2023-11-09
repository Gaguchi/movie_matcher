var movies = JSON.parse(document.getElementById('movies-data').textContent);

function drawWheel(movies) {
    var canvas = document.getElementById('movieWheelCanvas');
    var ctx = canvas.getContext('2d');
    var numberOfSegments = Math.min(movies.length, 8);
    var angle = 0;
    var arc = Math.PI * 2 / numberOfSegments;
    var outsideRadius = canvas.width / 2 - 20; // Adjust for edge padding
    var insideRadius = 20; // Small radius for the inner circle

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movies.forEach(function(movie, index) {
        // Draw slice
        var angleStart = angle + index * arc;
        var angleEnd = angleStart + arc;

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, outsideRadius, angleStart, angleEnd, false);
        ctx.arc(canvas.width / 2, canvas.height / 2, insideRadius, angleEnd, angleStart, true);
        ctx.closePath();
        ctx.fillStyle = 'hsl(' + (index * 360 / numberOfSegments) + ', 100%, 50%)'; // Color for the slice
        ctx.fill();

        // Load the image
        var image = new Image();
        image.onload = function() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, outsideRadius, angleStart, angleEnd, false);
            ctx.arc(canvas.width / 2, canvas.height / 2, insideRadius, angleEnd, angleStart, true);
            ctx.closePath();
            ctx.clip(); // Clip to the slice's shape

            // Calculate the position for the image
            var imageX = canvas.width / 2 + Math.cos(angleStart + arc / 2) * insideRadius;
            var imageY = canvas.height / 2 + Math.sin(angleStart + arc / 2) * insideRadius;

            // Calculate the scaled image size to fit within the segment
            var scale = Math.min((outsideRadius - insideRadius) / image.width, (outsideRadius - insideRadius) / image.height);
            scale *= 2;
            var scaledWidth = scale * image.width;
            var scaledHeight = scale * image.height;

            // Draw the image centered and rotated in the segment
            ctx.translate(imageX, imageY);
            ctx.rotate(angleStart + arc / 2 + Math.PI / 2);
            ctx.drawImage(image, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
            ctx.restore();
        };
        image.src = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + movie.fields.poster_path;
    });

    // Draw the indicator
    function drawIndicator() {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 10, 0);
        ctx.lineTo(canvas.width / 2 + 10, 0);
        ctx.lineTo(canvas.width / 2, 30);
        ctx.fill();
    }

    // Draw the center button
    function drawCenterButton() {
        // Draw white circle for the center button
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, insideRadius, 0, Math.PI * 2, false);
        ctx.fill();

        // Draw the button
        ctx.fillStyle = '#333'; // Button color
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, insideRadius / 2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('Spin', canvas.width / 2 - ctx.measureText('Spin').width / 2, canvas.height / 2 + 10);
    }
}

// Call the drawWheel function with your movies data
drawWheel(movies);
