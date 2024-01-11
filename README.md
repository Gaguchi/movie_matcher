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
 
## Files
## `views.py`

### `save_movie_data`
Handles the saving of movie data and user preferences. Gets the movie data that is sent to it with a POST request, checkes wheres the movie is 'interested', 'not interested, 'seen and liked' or 'seen and disliked' and saves the movie accordingly. If the movie has already been saved it updates the 'interested', 'not interested, 'seen and liked' or 'seen and disliked', so that when the user watches the movie they can update it accordingly (fer example if the user marks a movie that was previousely in the 'interested' table with 'seen_liked' the movie is taken out of the 'interested' table and is placed in the 'seen and liked' table).

### `wheel_of_movies`
Renders a page displaying a wheel of movies based on the user's interested movies. On request sends up to 8 movies from the 'intrested' table in JSON format.

### `plinko(request)`
Renders a page displaying a Plinko-style game with movies based on the user's interested movies.

### `index(request)`
Renders the homepage.

### `movie_profile(request, movie_id)`
Renders a page displaying details about a specific movie.

### `user_movies(request)`
Returns a JSON response containing all movies that the user has interacted with.

## URLs (`urls.py`)

Defines URL patterns for the `movie_match` app.

- `/`: Root URL, associated with the `index` view.
- `/save_movie_data/<int:movie_id>/`: URL pattern for saving movie data, associated with the `save_movie_data` view.
- `/wheel/`: URL pattern for the wheel of movies, associated with the `wheel_of_movies` view.
- `/plinko/`: URL pattern for Plinko game, associated with the `plinko` view.
- `/login/`: URL pattern for user login, associated with the `main_views.login_view`.
- `/movie_profile/<int:movie_id>/`: URL pattern for movie profile, associated with the `movie_profile` view.
- `/user_movies/`: URL pattern for user movie data, associated with the `user_movies` view.
