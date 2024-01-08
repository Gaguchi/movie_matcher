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

### views.py

#### save_movie_data

Handles the saving of movie data and user preferences.

#### wheel_of_movies

Displays a wheel of movies based on user preferences.

#### plinko

Renders a Plinko-style game with movies based on user preferences.

#### index

Displays the homepage.

#### movie_profile

Renders the movie profile page.

#### user_movies

Returns JSON response with all movies that the user has interacted with.

### models.py

Defines Django models for movies and users.

#### Movie Model

- Fields include `adult`, `backdrop_path`, `genre_ids`, `movie_id`, `original_language`, `original_title`, `overview`, `popularity`, `poster_path`, `release_date`, `title`, `video`, `vote_average`, and `vote_count`.

#### User Model

Extends Django's `AbstractUser` model and includes additional fields like `friends`, and various `movies_*` fields for different user interactions with movies.

## Usage

Ensure Django is properly configured, and migrations are applied before running the web app.

### Installation

1. Clone the repository.
2. Install dependencies using `pip install -r requirements.txt`.
3. Apply migrations with `python manage.py migrate`.

### Running the App

Execute `python manage.py runserver` and access the app in your browser at `http://localhost:8000/`.
