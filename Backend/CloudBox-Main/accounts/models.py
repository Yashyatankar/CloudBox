from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class User(AbstractUser):

    
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    phoneNum = models.CharField(unique=True, max_length=15)

    def __str__(self):
        return self.username


