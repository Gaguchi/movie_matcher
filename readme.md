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

I believe there are several factors that qualify this application for both distinctiveness and complexity. The app not only fetches movie data from a third party API it also generates its own and uses the generated API for fairly complex games. The react code in the index page first checkes whether the user is logged in or not (using djangos builtin authentication) after which it will fetch movies from the database (after checking of the active filters and applying those active filters) as well as the saved movies (movies that we saved by the user in the database as 'interested','not interested','liked','disliked'). We also check if the images are loaded correctly and if there is an error with the images the movies is skipped (this was added to improve user experience).

After the movies are fetched (and with filter options applied) they are checked against the saved movies (movies that the user already interacted with) and we filter out movies that the user has already interacted with. The database allows fetching movies in batches of 20. After the first batch is fetched but all the movies have already been interacted with by the user, and thereby have been filtered out, we iterate the page by one and keep fetching until a new movie that the user hasn't yet interacted with appears.

The successfully fetched and filtered movie data is passed on to the page and the data is used to display the movie cards for the user to interact with. If the user is interested in the movie they can swipe left to save the movie to their interested list, to the right if they aren't interested in the movie, or they can click either of the 'seen:liiked' or the 'seen:disliked' buttons if their have already seen the movie and liked it or disliked it. Each interaction is kept track of and when the number of interaction (either swipes of clicks) is equal to the amount of displayed movies in the current batch the next batch if fetche. The user then can continue interacting with the movies or use one of our games to help them choose with movie they should watch.

One of such games is what i call 'The wheel of movies'. When the wheel is loaded it 
 
# Files
## views.py (in this file we handle the data we get from the TMDB api as well as generate our own api to make working with our wheel and Plinko easier)

#### >  save_movie_data()
Handles the saving of movie data and user preferences. Gets the movie data that is sent to it with a POST request, checkes wheres the movie is 'interested', 'not interested, 'seen and liked' or 'seen and disliked' and saves the movie accordingly. If the movie has already been saved it updates the 'interested', 'not interested, 'seen and liked' or 'seen and disliked', so that when the user watches the movie they can update it accordingly (fer example if the user marks a movie that was previousely in the 'interested' table with 'seen_liked' the movie is taken out of the 'interested' table and is placed in the 'seen and liked' table).

#### >  wheel_of_movies()
Renders a page displaying a wheel of movies based on the user's interested movies. On request sends up to 8 movies from the 'intrested' table in JSON format.

#### >  plinko()
Renders a page displaying a Plinko-style game with movies based on the user's interested movies.

#### >  index()
Renders the homepage.

#### >  movie_profile
Renders a page displaying details about a specific movie.

#### >  user_movies
Returns a JSON response containing all movies that the user has interacted with.

## index.html (here we have the bulk of our React code)

#### >  MovieInfo()
This is a functional component responsible for rendering individual movie cards. It takes movie-related information as props and displays it along with buttons to indicate whether the user liked or disliked the movie.
#### >  App()
This is the main functional component that represents the entire application. It manages state variables, handles user interactions like swiping, and fetches movie data from the server. It also includes a set of helper functions like handleLikedClick, handleDislikedClick, moveToNextMovie, and handleImageError.
#### >  fetchMovies()
This function is responsible for fetching movie data from the server. It includes logic to filter out movies that the user has already seen and ensures that there are enough movies to display.
#### >  sendSwipeDataToServer()
This function sends data about the user's swipes (like, dislike) to the server for storage.
#### >  handleSwipeStyles()
This function calculates styles for the swipe animation, including card rotation and opacity based on the user's swipe.
#### >  handleMove(), handleStart(), handleEnd()
These functions handle user interactions with the swipe cards, including touch and mouse events. They determine whether a swipe is meaningful and trigger actions accordingly.
#### >  throttle()
This function is a utility for throttling the execution of a function so it doesn't run too frequently.

## Wheel.js

#### >  loadWheelImages()
Preloads images for the wheel based on the provided movie data. Calls the callback function when all images are loaded.
#### >  drawWheel()
Draws the wheel with movies on the canvas, considering the specified rotation angle.
#### >  drawIndicator()
Draws a static indicator on the canvas.
#### >  drawCenterButton()
Draws a static center button on the canvas with a "Spin" label.
#### >  calculateWinner()
Determines and logs the winning movie based on the final wheel angle.
#### >  spinWheel()
Initiates the spinning of the wheel, updating the rotation angle and calculating the winning movie when the spinning stops.
#### >  drawCenterButton() 
Draws a static center button on the canvas with a "Spin" label.
#### >  drawIndicator()
Draws a static indicator on the canvas.
#### >  window.onload
Sets up the initial configuration when the window is fully loaded. Retrieves the canvas element, parses movie data, and calls `loadWheelImages` and `drawWheel` to preload images and draw the initial wheel, respectively.
