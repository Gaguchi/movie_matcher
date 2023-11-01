from django.contrib import admin
from .models import Movie

class MovieAdmin(admin.ModelAdmin):
    list_display = ['title', 'movie_id', 'original_language', 'release_date', 'vote_average']
    search_fields = ['title', 'original_language']
    list_filter = ['release_date', 'original_language', 'adult']
    ordering = ['-release_date']

admin.site.register(Movie, MovieAdmin)
