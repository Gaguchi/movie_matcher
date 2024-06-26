# Generated by Django 4.2.6 on 2023-11-01 09:12

import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('movie_match', '0006_alter_movie_popularity_alter_movie_release_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='original_language',
            field=models.CharField(default='en', max_length=10),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='movie',
            name='original_title',
            field=models.CharField(default='1', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='movie',
            name='overview',
            field=models.TextField(default='1'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='movie',
            name='popularity',
            field=models.FloatField(default='1'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='movie',
            name='release_date',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='movie',
            name='title',
            field=models.CharField(default='title', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='movie',
            name='video',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='movie',
            name='vote_average',
            field=models.FloatField(default=0.0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='movie',
            name='vote_count',
            field=models.IntegerField(default=0.0),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='custom_user_groups', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('movies_disliked', models.ManyToManyField(blank=True, related_name='disliked_by_users', to='movie_match.movie')),
                ('movies_interested', models.ManyToManyField(blank=True, related_name='interested_users', to='movie_match.movie')),
                ('movies_liked', models.ManyToManyField(blank=True, related_name='liked_by_users', to='movie_match.movie')),
                ('movies_neutral', models.ManyToManyField(blank=True, related_name='neutral_users', to='movie_match.movie')),
                ('movies_not_interested', models.ManyToManyField(blank=True, related_name='not_interested_users', to='movie_match.movie')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='custom_user_permissions', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]
