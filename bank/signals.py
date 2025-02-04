from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Bank


@receiver(post_migrate)
def padronizar_bancos(sender, **kwargs):
    default_banks = [
        {'code': 41, 'name': 'Banrisul'},
        {'code': 318, 'name': 'BMG'},
        {'code': 626, 'name': 'C6 Bank'},
        {'code': 707, 'name': 'Daycoval'},
        {'code': 935, 'name': 'Facta Financeira'},
        {'code': 329, 'name': 'Happy Consig'},
        {'code': 623, 'name': 'PAN'},
        {'code': 33, 'name': 'Olé Consignado'},
        {'code': 29, 'name': 'Itaú Consignado'},
        {'code': 12, 'name': 'Inbursa'},
        {'code': 69, 'name': 'Crefisa'},
        {'code': 422, 'name': 'Safra'},
    ]

    for bank in default_banks:
        Bank.objects.get_or_create(code=bank['code'], defaults={'name': bank['name']})
