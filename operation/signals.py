from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Operation


@receiver(post_migrate)
def padronizar_bancos(sender, **kwargs):
    default_operations = [
        'Margem Livre',
        'Refinanciamento',
        'Portabilidade',
        'Refin da Portabilidade',
        'Cartão Consignado (RMC)',
        'Cartão Benefício (RCC)',
        'Saque Aniversário (FGTS)',
        'Empréstimo Pessoal',
        'Saque Complementar (RMC)',
        'Saque Complementar (RCC)',
    ]

    for operation in default_operations:
        Operation.objects.get_or_create(name=operation)
