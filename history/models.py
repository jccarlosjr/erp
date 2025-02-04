from django.db import models
from proposal.models import Proposal
from accounts.models import CustomUser

STATUS_CHOICES = [
    ('1', 'Aberto'),
    ('2', 'Aguardando Digitação'),
    ('3', 'Pendente Pré-digitação'),
    ('4', 'Pendente Formalização'),
    ('5', 'Aguardando Averbação'),
    ('6', 'Aguardando retorno CIP'),
    ('7', 'Pendente envio CIP'),
    ('8', 'Saldo Informado Aguardando Pagamento'),
    ('9', 'Aguardando Atuação Operacional'),
    ('10', 'Pendente CIP'),
    ('11', 'Pago'),
    ('12', 'Pagamento Devolvido'),
    ('13', 'Comissão Processada'),
    ('14', 'Cancelado'),
    ('15', 'Cancelamento Solicitado Pelo Parceiro'),
    ('16', 'Clonado'),
    ('17', 'Aguardando Portabilidade'),
    ('18', 'Pendente'),
    ('19', 'Andamento')
]

class History(models.Model):
    proposal = models.ForeignKey(Proposal, on_delete=models.CASCADE, related_name='proposal')
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=200, choices=STATUS_CHOICES, null=True, blank=True)
    obs = models.TextField(null=True, blank=True)
