from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from movie_match.models import *
import json
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
# Create your views here.

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)  # Log the user in
            return render(request, "home/index.html")
        else:
            return render(request, "home/index.html")
    else:
        return render(request, "home/index.html")

def logout_view(request):
    logout(request)
    return render(request, "home/index.html")

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

def index(request):
    # Assuming 'home' is a directory inside your 'templates' directory
    # and 'index.html' is the template you want to render
    return render(request, "home/index.html")


def user_search(request):
    username = request.GET.get('username', None)
    if username:
        users = User.objects.filter(username__icontains=username)
        return JsonResponse(list(users.values('id', 'username')), safe=False)
    return JsonResponse({'error': 'No username provided.'}, status=400)

@login_required
def add_friend(request, user_id):
    try:
        friend = User.objects.get(id=user_id)
        request.user.friends.add(friend)
        return JsonResponse({'status': 'success'}, status=200)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def profile_view(request, username):
    user = get_object_or_404(User, username=username)
    return render(request, 'home/profile.html', {'user': user})