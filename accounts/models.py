from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from company.models import Company, Room


ROLE_CHOICES = [
        ('vendedor', 'Vendedor'),
        ('supervisor', 'Supervisor'),
        ('gestor', 'Gestor'),
        ('operacional', 'Operacional'),
        ('admin', 'Administrador'),
    ]

class CustomUser(AbstractUser):
    company = models.ForeignKey(Company, on_delete=models.PROTECT, related_name="company", null=True, blank=True)
    room = models.ForeignKey(Room, on_delete=models.PROTECT, related_name="room", null=True, blank=True)
    role = models.CharField(max_length=100, choices=ROLE_CHOICES, default='vendedor')
    date_joined = models.DateField(auto_now=True)
    is_active = models.BooleanField(default=True)
    cms_blocked = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class UserSession(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    session_key = models.CharField(max_length=100)
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)
