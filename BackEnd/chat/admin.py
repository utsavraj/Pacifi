from django.contrib import admin
from .models import Messages, Emotions, Breathe, Jogging, Doodling

# Register your models here.
admin.site.register(Messages)
admin.site.register(Emotions)
admin.site.register(Breathe)
admin.site.register(Jogging)
admin.site.register(Doodling)
