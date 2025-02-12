from django.db import models
from table.models import Table
from accounts.models import CustomUser
from datetime import datetime
from django.apps import apps


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


FORM_TYPE_CHOICES = [
    ('físico', "Físico"),
    ('digital', "Digital")
]

FILE_TYPE_CHOICES = [
    ('RG', 'RG'),
    ('Contrato', 'Contrato'),
    ('Contracheque', 'Contracheque'),
    ('Outro', 'Outro')
]


def get_proposal_code(proposta):
    id = str(proposta.id).zfill(5)
    codigo_interno = datetime.now().strftime(f"PRO-%y%m%d{id}")
    return codigo_interno


class Proposal(models.Model):
    name = models.CharField(max_length=200)
    cpf = models.CharField(max_length=14, unique=False)
    birthdate = models.DateField()
    sex = models.CharField(max_length=10)
    is_foreigner = models.CharField(max_length=10, null=True, blank=True)
    email = models.EmailField(blank=True, null=True)
    is_illiterate = models.CharField(max_length=10, null=True, blank=True)
    rg = models.CharField(max_length=100)
    rg_public_agency = models.CharField(max_length=20)
    rg_uf = models.CharField(max_length=20)
    rg_created_date = models.DateField()
    naturality_city = models.CharField(max_length=50)
    naturality_uf = models.CharField(max_length=20)
    father = models.CharField(max_length=200)
    mother = models.CharField(max_length=200)
    telphone = models.CharField(max_length=15)
    celphone = models.CharField(max_length=15)
    postal_code = models.CharField(max_length=10)
    city = models.CharField(max_length=200)
    city_state = models.CharField(max_length=20)
    district = models.CharField(max_length=200)
    place = models.CharField(max_length=200)
    complement = models.CharField(max_length=100)
    house_number = models.CharField(max_length=20)
    agency_id = models.IntegerField()
    agency = models.CharField(max_length=10)
    agency_code = models.CharField(max_length=200)
    agency_uf = models.CharField(max_length=20)
    agency_is_cm = models.CharField(max_length=3)
    income = models.FloatField()
    account_type = models.CharField(max_length=10)
    account_bank = models.CharField(max_length=200)
    account_agency = models.IntegerField()
    account = models.IntegerField()
    account_dv = models.IntegerField()
    is_representated = models.CharField(max_length=10, default="NÃO")
    rep_cpf = models.CharField(max_length=14, null=True, blank=True)
    rep_name = models.CharField(max_length=200, null=True, blank=True)
    ade = models.CharField(max_length=50, unique=True, null=True, blank=True)
    is_blocked = models.BooleanField(default=False)
    internal_code = models.CharField(max_length=200, unique=True, null=True, blank=True)
    user = models.ForeignKey(CustomUser, related_name='proposal', on_delete=models.PROTECT)
    table = models.ForeignKey(Table, related_name='proposal', on_delete=models.PROTECT)
    installment = models.FloatField()
    ballance = models.FloatField(null=True, blank=True)
    total_amount = models.FloatField()
    exchange = models.FloatField()
    term = models.IntegerField()
    term_paids = models.IntegerField(null=True, blank=True)
    term_original = models.IntegerField(null=True, blank=True)
    contract = models.CharField(max_length=200, null=True, blank=True)
    original_bank = models.CharField(max_length=200, null=True, blank=True)
    observation = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=200, choices=STATUS_CHOICES, null=True, blank=True)
    last_update = models.DateTimeField(auto_now=True, null=True, blank=True)
    is_clone = models.BooleanField(default=False)
    is_cloned = models.BooleanField(default=False)
    cloned_by = models.CharField(max_length=200, blank=True, null=True)
    bound_proposal = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='bound_to')
    cms = models.FloatField(null=True, blank=True, default=0)
    dispatch = models.ForeignKey('financial.Dispatch', related_name='proposal_dispatches', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateField(auto_now_add=True, null=True, blank=True)
    is_delivered = models.BooleanField(default=True)
    form_type = models.CharField(max_length=50, choices=FORM_TYPE_CHOICES, default='digital')


    def save(self, *args, **kwargs):
        if not self.id:
            self.status = '1' 
            super().save(*args, **kwargs) 

        if not self.internal_code:
            self.internal_code = get_proposal_code(self)
            kwargs['force_insert'] = False
            super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return str(self.internal_code)


class ProposalFile(models.Model):
    proposal = models.ForeignKey(Proposal, related_name="files", on_delete=models.SET_NULL, null=True, blank=True)
    file = models.FileField(upload_to="proposals/")
    file_type = models.CharField(max_length=100, choices=FILE_TYPE_CHOICES, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(CustomUser, related_name="files", on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Arquivo para a proposta: {self.proposal.internal_code}"
