# Generated by Django 4.2.6 on 2023-10-26 22:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movie_match', '0002_alter_movie_genre_ids'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='original_language',
            field=models.CharField(max_length=10, null=True),
        ),
    ]
