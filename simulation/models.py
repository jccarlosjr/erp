from django.db import models
from accounts.models import CustomUser
from operation.models import Operation
from datetime import datetime


STATUS_CHOICES = [
    ('aberto', 'Aberto'),
    ('aguardando', 'Aguardando'),
    ('finalizada', 'Finalizada'),
]


def get_proposal_code(dispatch):
    id_str = str(dispatch.id).zfill(5)
    codigo_interno = datetime.now().strftime(f"SIM-%y%m%d{id_str}")
    return codigo_interno


class Installment(models.Model):
    installment = models.FloatField(null=True, blank=True)
    bank_destiny = models.CharField(max_length=100, null=True, blank=True)
    ballance = models.FloatField(null=True, blank=True)
    exchange = models.FloatField(null=True, blank=True)
    term = models.IntegerField(null=True, blank=True)
    term_paids = models.IntegerField(null=True, blank=True)
    term_original = models.IntegerField(null=True, blank=True)
    contract = models.CharField(max_length=200, null=True, blank=True)
    original_bank = models.CharField(max_length=200, null=True, blank=True)
    operation = models.CharField(max_length=200, null=True, blank=True)


class Simulation(models.Model):
    internal_code = models.CharField(max_length=50, unique=True, null=True, blank=True)
    date = models.DateField(auto_now_add=True)
    user = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name="user")
    cpf = models.CharField(max_length=14)
    observation = models.TextField(blank=True, null=True)
    last_update = models.DateTimeField(auto_now=True, null=True, blank=True)
    installment = models.ManyToManyField(Installment, related_name="installment_simulation", blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='aberto')


    def save(self, *args, **kwargs):
        if not self.internal_code:
            super().save(*args, **kwargs)
            self.internal_code = get_proposal_code(self)
            kwargs['force_insert'] = False
            super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return str(self.internal_code)

    def delete(self, *args, **kwargs):
        self.installment.all().delete()
        super().delete(*args, **kwargs)

