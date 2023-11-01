from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.db import IntegrityError
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from movie_match.models import *
import json
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)  # Log the user in
            return HttpResponseRedirect(reverse("movie_match:index"))
        else:
            return render(request, "movie_match/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "movie_match/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        
        print(f"Debug: username={username}, email={email}")  # Debugging line

        if password != confirmation:
            return render(request, "movie_match/register.html", {
                "message": "Passwords must match."
            })

        try:
            User = get_user_model()  # Get the user model
            user = User.objects.create_user(username, email, password)
            user.save()
            print(f"Debug: User created: {user}")
        except IntegrityError as e:
            print(f"Debug: IntegrityError {e}")
            return render(request, "movie_match/register.html", {
                "message": "Username already taken."
            })
        
        print(f"Debug: Authenticating username={username}, password={password}")  # Debugging line
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            print(f"Debug: User authenticated and logged in: {user}")
            return HttpResponseRedirect(reverse("movie_match:index"))
        else:
            print("Debug: User could not be authenticated")
            return render(request, "movie_match/register.html", {
                "message": "An error occurred. Please try again."
            })
    else:
        return render(request, "movie_match/register.html")
