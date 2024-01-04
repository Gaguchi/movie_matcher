from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.db import IntegrityError
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseNotAllowed, HttpResponseServerError
from .models import *
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core import serializers
import traceback


# Create your views here.

@csrf_exempt
def save_movie_data(request, movie_id=None):
    try:
        if request.method != 'POST':
            return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

        data = json.loads(request.body)
        is_interested = data.get('isInterested')
        is_not_interested = data.get('isNotInterested')
        seen_liked = data.get('seenLiked')
        seen_disliked = data.get('seenDisliked')

        # Check if the movie already exists in the database
        movie, created = Movie.objects.get_or_create(
            movie_id=movie_id,
            defaults={
                'adult': data.get('adult', False),
                'backdrop_path': data.get('backdrop_path'),
                'genre_ids': json.dumps(data.get('genre_ids', [])),
                'original_language': data.get('original_language'),
                'original_title': data.get('original_title'),
                'overview': data.get('overview'),
                'popularity': data.get('popularity'),
                'poster_path': data.get('poster_path'),
                'release_date': data.get('release_date'),
                'title': data.get('title'),
                'video': data.get('video', False),
                'vote_average': data.get('vote_average'),
                'vote_count': data.get('vote_count'),
            }
        )

        # Assuming the user is logged in
        if request.user.is_authenticated:
            request.user.movies_interested.remove(movie)
            request.user.movies_not_interested.remove(movie)
            request.user.movies_liked.remove(movie)
            request.user.movies_disliked.remove(movie)
            request.user.movies_neutral.remove(movie)

            if is_interested:
                request.user.movies_interested.add(movie)
            elif is_not_interested:
                request.user.movies_not_interested.add(movie)
            elif seen_liked:
                request.user.movies_liked.add(movie)
            elif seen_disliked:
                request.user.movies_disliked.add(movie)

        interested_movies_qs = request.user.movies_interested.all()[:8]
        interested_movies = serializers.serialize('json', interested_movies_qs)
        return JsonResponse({"message": "Movie data and preferences saved successfully.", "updated_movies": interested_movies}, status=201)


    except Exception as e:
        traceback.print_exc()  # Prints the full traceback
        return JsonResponse({"error": f"An error occurred: {e}"}, status=500)

@login_required
def wheel_of_movies(request):
    user = request.user
    interested_movies_qs = user.movies_interested.all()[:8]
    # Serializing the queryset to JSON format
    interested_movies = serializers.serialize('json', interested_movies_qs)
    return render(request, "movie_match/wheel_of_movies.html", {
        "interested_movies_json": interested_movies  # Pass the serialized JSON to the template
    })

@login_required
def plinko(request):
    user = request.user
    interested_movies_qs = user.movies_interested.all()[:5]
    interested_movies_length = len(interested_movies_qs)  # Get the length of the queryset
    # Serializing the queryset to JSON format
    interested_movies = serializers.serialize('json', interested_movies_qs)
    return render(request, "movie_match/plinko.html", {
        'interested_movies_json': interested_movies,
        'interested_movies_length': interested_movies_length,
    })

def index(request):
    return render(request, "home/index.html")

def movie_profile(request, movie_id):
    return render(request, 'movie_match/movie_profile.html', {'movie_id': movie_id})


@login_required
def user_movies(request):
    user = request.user

    # Get all movies that the user has interacted with
    user_movies = user.movies_interested.all() | user.movies_not_interested.all() | user.movies_liked.all() | user.movies_disliked.all() | user.movies_neutral.all()

    # Serialize the movies to JSON
    user_movies_json = serializers.serialize('json', user_movies)

    return JsonResponse(user_movies_json, safe=False)