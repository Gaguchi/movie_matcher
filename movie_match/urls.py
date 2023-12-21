from django.urls import path
from . import views as movie_match_views  # Views from the current app
from movies_project import views as main_views  # Views from the main project

app_name = 'movie_match'

urlpatterns = [
    path('', movie_match_views.index, name='index'),
    path('save_movie_data/<int:movie_id>/', movie_match_views.save_movie_data, name='save_movie_data'),
    path('wheel/', movie_match_views.wheel_of_movies, name='wheel_of_movies'),
    path('plinko/', movie_match_views.plinko, name='plinko'),
    path('login/', main_views.login_view, name='login'),
]
