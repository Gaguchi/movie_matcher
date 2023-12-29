# Movie Matcher - CS50W Capstone project

Movie Matcher is an app for people who have a hard time deciding what movie to watch. This app will match the users up with movies which they can express interest in or reject and includes a "Wheel of Movies" that you can spin to decide which movie you're watching next.

This app was made with django and react.

## Installation

Foe this app to work you need to install django and register on tmdb.org to get an api key (that you will then need to paste into index.html file [on line 25]).

```bash
pip install django
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

## Distinctiveness and Complexity

I believe this project satisfies the requirements for both distinctiveness and complexity for the following reasons: This project uses APIs from third-party sources as well as generating APIs of its own. The custom-made "Wheel of Movies" not only generates a wheel with correct proportions for its segment and movie posters inside those segments but also can rotate and read which movie the wheel lands on, after which it can utilise django views to update the database based on user input and generate the wheel again, dynamically adjusting the segments of the wheel (meaning a wheel with fewer segments will have larger segments). 
 
## Files of note
* Layout_v2.html - this file is using django template system to export footer and header to other html template files.
* index.html - fetches the movie data from the external API and saves the modified movie information on to the server.
* profile.html - displayed the saved movies 
* wheel_of_movies.html - displays the wheel of movies and handles the sending of the movie data to the server (similar to index.html)  
* custom.js - handles the display setting and the preloader animation
* wheel.js - handles the drawing of the wheel, the images on the wheel, the spin of the wheel, the drawing of the indicator and the spin sign and the calculation of the winning movie.
* movies_project/views.py - handles user login and registration 
* movie_match/views.py - handles saving movies onto the server and sends the movie data to the wheel_of_movies.html
* movie_match/models.py - handles the movies and the users models
