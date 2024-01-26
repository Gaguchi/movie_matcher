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

One of such games is what i call 'The wheel of movies'. When the wheel page is loaded the movie data is sent to through the wheel_of_movies view, we use that movie data to fill out the wheel sections. Up to 8 movies that the user is interested in is displayed to the user on the wheel. Below the wheel we render a modal that is hidden until a winning movie is determined, more datail about the workings of the wheen of movies can be found in the files section below. Note that even though we render a indicator it is purely for UX reasons so the users have a static object to better see which movie the wheel settled upon. 

The other game that we have is our version of Plinko. It's somewhat similar to the wheel in the fact that it also draws its data from a view and helps the user choose which movie to watch. The plinko game works like this: the user drop a ball down the plinko board (through cliking on the general are where they with to drop the ball), the ball them drops unto and bounces off pegs to land at the bottom into one of the secctions that contain movies. The ball dropping to the end triggers a modal  with the winning movie to appear similar to the wheel at which point the user either accepts to watch the movie and leaves feedback on whether they liked it or not or closes the modal to drop another ball.

For more justification of distinctiveness and (especially) complexity please read through the files section.
 
# Files
These are the main files that we use to make our app work. Some are relatively simple (for example models.py just contains the relevant models) but some too significantly more work (like the "game" files: wheel.js and plinko.js). For simpler files ill write more briefly but ill write more details for more complex files.

## Here is the list of the most important files for our app:
* Django files:
  * **models.py**:
    * contains models for our movies and users
  * **views.py**:
    * handles the standard views (like displaying the index page and other profile page) as well as saving the movie data correctly. The save_movie_data, upon a POST request, creates a movie object and saves it to the database. Upon save the movie is removed from the following tables
       ```bash
       movies_interested = models.ManyToManyField('Movie', related_name='interested_users', blank=True)
       movies_not_interested = models.ManyToManyField('Movie', related_name='not_interested_users', blank=True)
       movies_liked = models.ManyToManyField('Movie', related_name='liked_by_users', blank=True)
       movies_disliked = models.ManyToManyField('Movie', related_name='disliked_by_users', blank=True)
       movies_neutral = models.ManyToManyField('Movie', related_name='neutral_users', blank=True)
       ```
      and is added back to an appropriate table, this is done to make sure there are no duplicates because it wouldn't make sense for a movie to be in more than one of these tables. This file also handles sending of the movies data to the wheel and plinko pages (we are sending ```user.movies_interested``` to the pages and in the case of plinko we also send the amount or movies in int form that we then use to remind the user that they need to have at least 5 movies in their 'interested' table for the plinko game to activate.
  * **urls.py**
    * handles the urls for our app for simple page displays and api requests
* Templates
  * **index.html**
    * This file first check if the user is logged in and if not the user is presented with a login form and a link to the registration form. After it is confirmed that the user is authenticated and the domcontent is loaded we initiate our react app. The app does the following: It gets the movie data from an tmdb api. 

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
