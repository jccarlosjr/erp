from django.db import models
from datetime import datetime
from accounts.models import CustomUser
from proposal.models import Proposal


def get_proposal_code(dispatch):
    id_str = str(dispatch.id).zfill(5)
    codigo_interno = datetime.now().strftime(f"REL-%y%m%d{id_str}")
    return codigo_interno


class Dispatch(models.Model):
    internal_code = models.CharField(max_length=200, unique=True, null=True, blank=True)
    date = models.DateField()
    user = models.ForeignKey(CustomUser, related_name='dispatch', on_delete=models.PROTECT)
    production = models.FloatField()
    bonification = models.FloatField(null=True, blank=True)
    total_comission = models.FloatField(null=True, blank=True)
    deduction = models.FloatField()
    comission = models.FloatField()
    proposals = models.ManyToManyField(Proposal, related_name='dispatches', blank=True)

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