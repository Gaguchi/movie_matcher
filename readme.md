# Movie Matcher - CS50W Capstone project

Having trouble picking your next movie to watch? Too many choices in movies that youre interested in have you paralised from the sheer number of choices? Well fear not! Movie Matcher is here to help! Movie Matcher will present you with a random movie from all different ganres and countries, simply swipe right if you're interested and swipe left if you are not. You now have a list of movies that you might not have even heard of before but have intrigued you for one reason or another, still can't choose which movie to watch first? Use our "wheel of movies" or "plinko" games to see which of the movies you're interested in you'll land on and now you'll have to watch that one (unless you didn't like what you landed on, in which case you can try again). Theres an ocean of movies out there waiting to be discovered by you, all you have to do is dive in!

This app was made with django and react.

## Installation

For this app to work you need to install django and register on tmdb.org to get an api key (that you will then need to paste into index.html file [on line 25]).

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
