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
Handles the saving of movie data and user preferences. Gets the movie data that is sent to it with a POST request, checkes wheres the movie is 'interested', 'not interested, 'seen and liked' or 'seen and disliked' and saves the movie accordingly. If the movie has already been saved it updates the 'interested', 'not interested, 'seen and liked' or 'seen and disliked', so that when the user watches the movie they can update it accordingly.

- **Method**: POST
- **Parameters**:
  - `request`: Django request object.
  - `movie_id`: Optional parameter indicating the movie ID.
- **Flow**:
  1. Parses JSON data from the request body.
  2. Checks if the movie already exists in the database, updates or creates a new entry.
  3. Associates user preferences with the movie based on the received data.
  4. Returns a JSON response with a success message and the updated list of interested movies.
- **Error Handling**: Catches exceptions, prints the traceback, and returns an error response if an exception occurs.

### `wheel_of_movies(request)`
Renders a page displaying a wheel of movies based on the user's interested movies.

- **Method**: GET
- **Parameters**:
  - `request`: Django request object.
- **Flow**:
  1. Fetches interested movies for the current user.
  2. Serializes the queryset to JSON format.
  3. Renders the 'wheel_of_movies.html' template, passing the serialized JSON to the template.
- **Access Control**: Requires user authentication.

### `plinko(request)`
Renders a page (likely a Plinko-style game) with movies based on the user's preferences.

- **Method**: GET
- **Parameters**:
  - `request`: Django request object.
- **Flow**:
  1. Fetches interested movies for the current user.
  2. Serializes the queryset to JSON format.
  3. Renders the 'plinko.html' template, passing the serialized JSON and the length of the queryset to the template.
- **Access Control**: Requires user authentication.

### `index(request)`
Renders the homepage.

- **Method**: GET
- **Parameters**:
  - `request`: Django request object.
- **Flow**: Renders the 'home/index.html' template.

### `movie_profile(request, movie_id)`
Renders a page displaying details about a specific movie.

- **Method**: GET
- **Parameters**:
  - `request`: Django request object.
  - `movie_id`: Movie ID to display details for.
- **Flow**: Renders the 'movie_match/movie_profile.html' template, passing the movie_id to the template.

### `user_movies(request)`
Returns a JSON response containing all movies that the user has interacted with.

- **Method**: GET
- **Parameters**:
  - `request`: Django request object.
- **Flow**:
  1. Fetches all movies that the user has interacted with.
  2. Serializes the movies to JSON.
  3. Returns a JSON response with the serialized data.
- **Access Control**: Requires user authentication.

## URLs (`urls.py`)

Defines URL patterns for the `movie_match` app.

- `/`: Root URL, associated with the `index` view.
- `/save_movie_data/<int:movie_id>/`: URL pattern for saving movie data, associated with the `save_movie_data` view.
- `/wheel/`: URL pattern for the wheel of movies, associated with the `wheel_of_movies` view.
- `/plinko/`: URL pattern for Plinko game, associated with the `plinko` view.
- `/login/`: URL pattern for user login, associated with the `main_views.login_view`.
- `/movie_profile/<int:movie_id>/`: URL pattern for movie profile, associated with the `movie_profile` view.
- `/user_movies/`: URL pattern for user movie data, associated with the `user_movies` view.
