# Generated by Django 4.2.6 on 2023-10-26 21:09

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('adult', models.BooleanField(default=False)),
                ('backdrop_path', models.CharField(blank=True, max_length=255, null=True)),
                ('genre_ids', models.JSONField()),
                ('movie_id', models.IntegerField(unique=True)),
                ('original_language', models.CharField(max_length=10)),
                ('original_title', models.CharField(max_length=255)),
                ('overview', models.TextField()),
                ('popularity', models.FloatField()),
                ('poster_path', models.CharField(blank=True, max_length=255, null=True)),
                ('release_date', models.DateField()),
                ('title', models.CharField(max_length=255)),
                ('video', models.BooleanField(default=False)),
                ('vote_average', models.FloatField()),
                ('vote_count', models.IntegerField()),
            ],
        ),
    ]
