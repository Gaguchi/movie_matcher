from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

# Create your models here.

class Movie(models.Model):
    adult = models.BooleanField(default=False)
    backdrop_path = models.CharField(max_length=255, null=True, blank=True)
    genre_ids = models.TextField()
    movie_id = models.IntegerField(unique=True)  # Corresponds to "id" in the JSON
    original_language = models.CharField(max_length=10)
    original_title = models.CharField(max_length=255)
    overview = models.TextField()
    popularity = models.FloatField()
    poster_path = models.CharField(max_length=255, null=True, blank=True)
    release_date = models.DateField()
    title = models.CharField(max_length=255)
    video = models.BooleanField(default=False)
    vote_average = models.FloatField(default=0.0)
    vote_count = models.IntegerField(default=0.0)

    def __str__(self):
        return self.title


class User(AbstractUser):
    friends = models.ManyToManyField('self', related_name='friend_set', symmetrical=True, blank=True)

    movies_interested = models.ManyToManyField('Movie', related_name='interested_users', blank=True)
    movies_not_interested = models.ManyToManyField('Movie', related_name='not_interested_users', blank=True)
    movies_liked = models.ManyToManyField('Movie', related_name='liked_by_users', blank=True)
    movies_disliked = models.ManyToManyField('Movie', related_name='disliked_by_users', blank=True)
    movies_neutral = models.ManyToManyField('Movie', related_name='neutral_users', blank=True)

    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="custom_user_groups",
        related_query_name="user",
    )

    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="custom_user_permissions",
        related_query_name="user",
    )

    def __str__(self):
        return self.username

