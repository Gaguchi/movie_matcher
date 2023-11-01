from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.db import IntegrityError
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseNotAllowed, HttpResponseServerError
from .models import *
import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

@csrf_exempt
def save_movie_data(request, movie_id=None):
    try:
        if request.method != 'POST':
            return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

        data = json.loads(request.body)
        is_liked = data.get('isLiked')

        # Check if the movie already exists in the database
        movie_exists = Movie.objects.filter(movie_id=movie_id).exists()

        if not movie_exists:
            # Create a new Movie object
            new_movie = Movie(
                movie_id=movie_id,
                adult=data.get('adult', False),
                backdrop_path=data.get('backdrop_path'),
                genre_ids=json.dumps(data.get('genre_ids', [])),
                original_language=data.get('original_language'),
                original_title=data.get('original_title'),
                overview=data.get('overview'),
                popularity=data.get('popularity'),
                poster_path=data.get('poster_path'),
                release_date=data.get('release_date'),
                title=data.get('title'),
                video=data.get('video', False),
                vote_average=data.get('vote_average'),
                vote_count=data.get('vote_count'),
            )
            new_movie.save()

        # Assuming the user is logged in
        if request.user.is_authenticated:
            movie = Movie.objects.get(movie_id=movie_id)
            if is_liked:
                request.user.movies_interested.add(movie)
            else:
                request.user.movies_not_interested.add(movie)

        return JsonResponse({"message": "Movie data and preferences saved successfully."}, status=201)

    except Exception as e:
        print(f"An error occurred: {e}")
        return JsonResponse({"error": f"An error occurred: {e}"}, status=500)


def index(request):
    return render(request, "movie_match/index.html")
