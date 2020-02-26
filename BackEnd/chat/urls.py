from django.urls import path
from .views import receiveMessages, clearChat, getChat, processImage, saveBreathe, saveJogging, saveDoodling, StressWheel

urlpatterns = [
    path('receiveMessages/', receiveMessages),
    path('clearChat/', clearChat),
    path('getChat/', getChat),
    path('processImage/', processImage),
    path('saveBreatheTime/', saveBreathe),
    path('saveJoggingSteps/', saveJogging),
    path('saveDoodlingTime/', saveDoodling),
    path('stresswheel/', StressWheel)
]