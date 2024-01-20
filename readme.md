# Movie Matcher - CS50W Capstone project

Movie Matcher is an app for people who have a hard time deciding what movie to watch. This app will match the users up with movies which they can express interest in or reject and includes a "Wheel of Movies" that you can spin to decide which movie you're watching next.

This app was made with django and react.

# Installation

Foe this app to work you need to install django and register on tmdb.org to get an api key (that you will then need to paste into index.html file [on line 25]).

```bash
pip install django
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

# Distinctiveness and Complexity

I believe this project satisfies the requirements for both distinctiveness and complexity for the following reasons: This project uses APIs from third-party sources as well as generating APIs of its own. The custom-made "Wheel of Movies" not only generates a wheel with correct proportions for its segment and movie posters inside those segments but also can rotate and read which movie the wheel lands on, after which it can utilise django views to update the database based on user input and generate the wheel again, dynamically adjusting the segments of the wheel (meaning a wheel with fewer segments will have larger segments). 
 
# Files
## views.py

#### >  save_movie_data
Handles the saving of movie data and user preferences. Gets the movie data that is sent to it with a POST request, checkes wheres the movie is 'interested', 'not interested, 'seen and liked' or 'seen and disliked' and saves the movie accordingly. If the movie has already been saved it updates the 'interested', 'not interested, 'seen and liked' or 'seen and disliked', so that when the user watches the movie they can update it accordingly (fer example if the user marks a movie that was previousely in the 'interested' table with 'seen_liked' the movie is taken out of the 'interested' table and is placed in the 'seen and liked' table).

#### >  wheel_of_movies
Renders a page displaying a wheel of movies based on the user's interested movies. On request sends up to 8 movies from the 'intrested' table in JSON format.

#### >  plinko
Renders a page displaying a Plinko-style game with movies based on the user's interested movies.

#### >  index
Renders the homepage.

#### >  movie_profile
Renders a page displaying details about a specific movie.

#### >  user_movies
Returns a JSON response containing all movies that the user has interacted with.

## index.html (here we have the bulk of our React code)

#### >  MovieInfo
This is a functional component responsible for rendering individual movie cards. It takes movie-related information as props and displays it along with buttons to indicate whether the user liked or disliked the movie.

#### >  App
This is the main functional component that represents the entire application. It manages state variables, handles user interactions like swiping, and fetches movie data from the server. It also includes a set of helper functions like handleLikedClick, handleDislikedClick, moveToNextMovie, and handleImageError.

#### >  fetchMovies
This function is responsible for fetching movie data from the server. It includes logic to filter out movies that the user has already seen and ensures that there are enough movies to display.

#### >  sendSwipeDataToServer
This function sends data about the user's swipes (like, dislike) to the server for storage.

#### >  handleSwipeStyles
This function calculates styles for the swipe animation, including card rotation and opacity based on the user's swipe.

#### >  handleMove, handleStart, handleEnd
These functions handle user interactions with the swipe cards, including touch and mouse events. They determine whether a swipe is meaningful and trigger actions accordingly.

#### >  throttle
This function is a utility for throttling the execution of a function, ensuring it doesn't run too frequently.
