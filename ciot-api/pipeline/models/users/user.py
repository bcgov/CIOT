from django.contrib.gis.db import models
from django.utils import timezone

class User(models.Model):
    """
    User model to attach info to assignments to communities
    """
    name = models.CharField(max_length=255, blank=False, null=False)
    email = models.CharField(max_length=255, blank=False, null=False)
    role = models.CharField(max_length=255, blank=False, null=False)
    deleted = models.BooleanField(default=False, help_text="This is for soft deletes")
    date_created = models.DateTimeField(default=timezone.now)
    is_admin = models.BooleanField(default=False)

