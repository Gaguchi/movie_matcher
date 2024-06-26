# Generated by Django 4.2.6 on 2023-10-26 22:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movie_match', '0005_alter_movie_overview'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='popularity',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='movie',
            name='release_date',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='movie',
            name='title',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='movie',
            name='video',
            field=models.BooleanField(default=False, null=True),
        ),
        migrations.AlterField(
            model_name='movie',
            name='vote_average',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='movie',
            name='vote_count',
            field=models.IntegerField(null=True),
        ),
    ]
