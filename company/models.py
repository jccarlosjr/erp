from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=200)
    cnpj = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name


class Room(models.Model):
    name = models.CharField(max_length=200)
    company = models.ForeignKey(Company, on_delete=models.PROTECT, related_name="room")

    def __str__(self):
        return self.name
