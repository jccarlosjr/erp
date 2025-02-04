from django.db import models
from operation.models import Operation
from bank.models import Bank

CMS_CHOICES = [
    ('bruto', 'Bruto'),
    ('liquido', 'Líquido')
]

class Table(models.Model):
    name = models.CharField(max_length=30)
    operation = models.ForeignKey(Operation, related_name='operation', on_delete=models.PROTECT)
    bank = models.ForeignKey(Bank, related_name='operation', on_delete=models.PROTECT)
    coefficient = models.CharField(max_length=20, default='0')
    rate = models.FloatField()
    term = models.IntegerField()
    is_active = models.BooleanField(default=True)
    cms = models.CharField(max_length=20, default='0')
    cms_type = models.CharField(max_length=200, choices=CMS_CHOICES, default='liquido')

    def __str__(self):
        return self.name
