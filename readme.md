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
    * This file first check if the user is logged in and if not the user is presented with a login form and a link to the registration form. After it is confirmed that the user is authenticated and the domcontent is loaded we initiate our react app. The app does the following: It gets the movie data from an tmdb api with selected ganres in descending order of popularity. The page also loads a filter menu with the ganres that the user can choose (the ganres and the ganre code were taken from the tmbd api manual), [there used to de a selector for the order (acending or decending order of popularity rating etc but it didn;t work as well as i intended so i removed it. The reason for the removal was that it took a movie to get rated only a few times with positive reviews for it to shoot up to the number one spot in ratings and i felt that a movie needed more ratings to be proven as a high quality movie. Also i didn;t make sense to me why anyone would want to look for least popular movies either.) so the 'sortOption' just defaults to descending popular and i left it at that.]. Lets take a closer look at the movie cards that we render; They are meant to resenble the cards from apps like tinder for a more intuative experiense and so that the users instinctively understand that they have to swipe to show interest in the movie (the 
      ```
      <div class="dzSwipe_card__option dzReject">
        <i class="fa-solid fa-xmark"></i>
      </div>
      <div class="dzSwipe_card__option dzLike">
        <i class="fa-solid fa-check"></i>
      </div>
      ``` 
	    are meant to also tell the user which side to swipe since depending on the direction a red x mard or a green check mark will appear) and the seen liked and disliked buttons in case the user has already seen the movie. In an earlier draft i had overviews of the movies that were all different legths and some too long so i at first trunchated them with
	    ```
	      const truncatedOverview = movie && movie.overview && movie.overview.length > 150 
	      ? `${movie.overview.substring(0, 150)}...` 
	      : movie && movie.overview || '';
		```
	    but the overviews still didn't look quite right so i decided to just add a page for each movie with full overview instead. At first I set the swipe distance (the minimum distance that the user needs to trigger in order for the swipe to be accepted) to be calculated from the middle of the pagebut this caused an issue where a user coudnt swipe left, for example, when they begun from the right side of the screen because the swipe right would automatically trigger when the user begun further than 200px to the right (200px was our trigger point), so instead i set the start of the swipe to the x coordinate of the mouse when the swiping motion is initiated 
	      ```
	        const initialX = e.clientX || e.touches[0].clientX;
	        setStartX(initialX);
	      ```.
	The swiping function also handles quality of life features like the red X and the green checkmark as well as othe miscelenious animations (like returning the card smoothily back if the trigger of 200 px wasnt reached. I used to jump back before we added 
		```                    
		if (!isSwiping && !isMeaningfulSwipe) {
		return { 
		    cardStyle: { transition: 'transform 0.3s ease-out' }, 
		    likeStyle: { opacity: 0 },
		    rejectStyle: { opacity: 0 }
		};
		}
		```

  * **wheel_of_movies.html**
    * This page is responsible for displaying the wheel of movies. Since the majority of the script is located inside the wheel.js file ill talk about wheel_of_movies.html briefly. It contains a canvas, a modal and hidden json what we get from the view to operate as well as standard react code for our app (like sendMovieData() that updates the movie data for the user), some functions that i used to help me draw and adjust the wheel so it looks correct (i used boolean inputs to adjust angles and rotations, which then are applied to help with calculating the winner). I'll write in more detail below when discussing wheel.js file.
      
  * **plinko.html**
    * This page is similar in its structure to the wheel_of_movies.html in the way that the main bulk of code is located in the corresponsponding plinko.js file.
* JavaScript files
  * **wheel.js**
    * The variables in the beginning of the code (for example the image scale and image position variables) were tied to range type inputs for the debugging purposes and to play around with the placement and the size of the images for the best visual effect. The other important variable is the angleoffset that helps with calculating the winning movie, if for example we want to change the position where the winning movie lands from the top of the wheel to the left or to the right this would be the varibale we will change to update the winner calculation.
    * The loadWheelImages populates the ```var wheelImages = [];``` by accessing the movie data (the data is first sent by our view, which then is saved into ```<div id="movies-data" style="display:none;">{{ interested_movies_json|safe }}</div>```, that on load is sent to the loadWheelimages, if the movieWheelCanvas has been loaded of course through this function
      ```
		window.onload = function () {
		var canvasElement = document.getElementById("movieWheelCanvas");
		if (canvasElement) {
		var moviesDataElement = document.getElementById("movies-data");
		if (moviesDataElement) {
		    var moviesData = JSON.parse(moviesDataElement.textContent);
		    loadWheelImages(moviesData, function () {
			drawWheel(canvasElement, 0)
		    })
		} else console.error("Movies data element not found")
		} else console.error("Canvas element not found")
		};
  		```
      The drawWheel draws the wheel on a canves at a given angle (sent to it from the function above ```drawWheel(canvasElement, 0)```), it calculates the number of sections (max 8) and the angle by diving the circle (2π) by the number of sections. This makes sure that all the sections are always the same size as each other. For each image and the section is calculates its position and size on the wheel based on the roatation angle and the number of sections and applies styling (some of which i duplicated for the button in the middle and the indicator to give all the elements similar feel), at first i had sections in different colours but then i decided to repeat two color and assigning them based on is the index of the section is even or odd ```context.fillStyle = index % 2 == 0 ? "#eeeeee" : "#dbdbdb";```.
    * Draw drawIndicator and function drawCenterButton draw simple elements with similar styling to the wheel to make it easer for the user to see which movie they landed on and where they need to click to spin the wheel (even though anywhere on the wheel is clickable for the spin).
    * Heres how calculateWinner function works: first it normalizes the rotationAngle to a value between 0 and 360 degrees. If the rotationAngle is negative, it adds 360 to it to make it positive. It then calculates an adjustedAngle by adding the normalizedAngle, the adjustedAngleOffset, and half of the angle of each section of the wheel (the adjustedAngle variable had to be added to manually fix an issue with the wrong movie sometimes being selected). The result is then normalized to a value between 0 and 360 degrees.The winningIndex is then calculated by multiplying the number of images by (1 - adjustedAngle / 360). This gives the index of the winning movie in the movieData array.If the winningIndex is valid (i.e., it is greater than or equal to 0 and less than the length of the movieData array), it retrieves the winning movie from the movieData array and logs its title to the console (this was used for debugging purposes and can be removed later). It then updates the winningMovieData global variable with the winning movie. It them gets the modal, updates the fields and displays it.
    * The spinWheel function works like this: At the start, it checks if the wheel is spinning by checking the isSpinning variable and if it is then the function won't run (this is to prevent the spin from being initiated while the wheel is already spinning) and it checks is the movie data has been loaded, and if it hasn't it will not run. It then rotates the wheel completely at least 5 times (it looked better to me that way) and updates the wheelRotationAngle global variable with the final rotation angle modulo 360. This gives a value between 0 and 360 degrees. It sets a spinInterval that gradually increases the current rotation angle of the wheel and redraws the wheel at the new angle. The current rotation angle is increased by 10% of the difference between the final rotation angle and the current rotation angle. If the difference between the final rotation angle and the current rotation angle is less than 0.5, it clears the spinInterval, sets isSpinning to false to indicate that the wheel has stopped spinning, and calls the calculateWinner function to calculate the winning movie
  * **plinko.js**
    * To understand how the plinko game works we have to understand how the ball element works and how it interacts with the pegs and behaves in, what I believe, a realistic manner. The main parameters for us are the gravity, friction and bounciness of the balls. Gravity and friction are handled by the ```update``` method and the bounciness by the ```bounce``` method. So lets look at all the methods of the ball class individually:
      * constructor creates the object and sets the gravity, friction, bounciness and other variables for the object. It is a fairly straightforward method the only thing i would note about it is that it used to take ```yCoordinate``` but i found plinko to work much better if we have a constant y, so that the ball is always generated at the top but the user can still choose the x-axis.
      * update method is responsible for updating the state of the ball at each frame. We first apply gravity to the vertical velocity of the object (that we set to 0 in the constructor) using this line ```this.vy += this.gravity;``` this is to simulate the ball accelerating downwards. And working in the opposite direction we of course have friction, that we use to reduce the horizontal and vertical velocities, with these lines ```this.vx *= this.friction;``` and ```this.vy *= this.friction;```. Once the velocities have been set we update the positions x and y of our ball using these lines: ```this.x += this.vx;``` and ```this.y += this.vy;```. And when the ball hits the bottom of our canvas the if statement makes sure to set the vertical velocity to -1 making sure the ball doesn't move (i had an issue where the ball would phase through the canvas once it hit the bottom and this if statement fixed that issue).
      * bounce method
      
