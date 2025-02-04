from django.db import models

class Bank(models.Model):
    code = models.IntegerField()
    name = models.CharField(max_length=50)

    def __str__(self):
        return str(self.name)
