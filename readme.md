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
    * This file first check if the user is logged in and if not the user is presented with a login form and a link to the registration form. After it is confirmed that the user is authenticated and the domcontent is loaded we initiate our react app. The app does the following: It gets the movie data from an tmdb api with selected ganres in descending order of popularity. The page also loads a filter menu with the ganres that the user can choose (the ganres and the ganre code were taken from the tmbd api manual), [there used to de a selector for the order (acending or decending order of popularity rating etc but it didn;t work as well as i intended so i removed it. The reason for the removal was that it took a movie to get rated only a few times with positive reviews for it to shoot up to the number one spot in ratings and i felt that a movie needed more ratings to be proven as a high quality movie. Also i didn;t make sense to me why anyone would want to look for least popular movies either.) so the 'sortOption' just defaults to descending popular and i left it at that.]. Lets take a closer look at the movie cards that we render; They are meant to resenble the cards from apps like tinder for a more intuative experiense and so that the users instinctively understand that they have to swipe to show interest in the movie (the ```
					<div class="dzSwipe_card__option dzReject">
						<i class="fa-solid fa-xmark"></i>
					</div>
					<div class="dzSwipe_card__option dzLike">
						<i class="fa-solid fa-check"></i>
					</div>``` are meant to also tell the user which side to swipe since depending on the direction a red x mard or a green check mark will appear) and the seen liked and disliked buttons in case the user has already seen the movie. In an earlier draft i had overviews of the movies that were all different legths and some too long so i at first trunchated them with ```                const truncatedOverview = movie && movie.overview && movie.overview.length > 150 
                    ? `${movie.overview.substring(0, 150)}...` 
                    : movie && movie.overview || '';``` but the overviews still didn't look quite right so i decided to just add a page for each movie with full overview instead.