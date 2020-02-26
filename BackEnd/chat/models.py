from django.db import models
from django.contrib.auth.models import User

class Messages(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver")
    content = models.TextField(blank=True, null=True)
    createdAt = models.DateTimeField("Created At", auto_now_add=True)
    anger = models.FloatField(blank=True)
    analytical = models.FloatField(blank=True)
    confident = models.FloatField(blank=True)
    tentative = models.FloatField(blank=True)
    fear = models.FloatField(blank=True)
    joy = models.FloatField(blank=True)
    sadness = models.FloatField(blank=True)

    def __str__(self):
        return self.content

class Emotions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owner")
    createdAt = models.DateTimeField("Created At", auto_now_add=True)
    anger = models.FloatField(blank=True)
    contempt = models.FloatField(blank=True)
    disgust = models.FloatField(blank=True)
    fear = models.FloatField(blank=True)
    happiness = models.FloatField(blank=True)
    neutral = models.FloatField(blank=True)
    sadness = models.FloatField(blank=True)
    surprise = models.FloatField(blank=True)

class Breathe(models.Model):
    person = models.ForeignKey(User, on_delete=models.CASCADE)
    createdAt = models.DateTimeField("Created At", auto_now_add=True)
    time = models.TimeField(auto_now=False, auto_now_add=False, blank=True)


class Jogging(models.Model):
    person = models.ForeignKey(User, on_delete=models.CASCADE)
    createdAt = models.DateTimeField("Created At", auto_now_add=True)
    steps = models.IntegerField(blank=True)


class Doodling(models.Model):
    person = models.ForeignKey(User, on_delete=models.CASCADE)
    createdAt = models.DateTimeField("Created At", auto_now_add=True)
    time = models.TimeField(auto_now=False, auto_now_add=False, blank=True)


