# Generated by Django 5.1.1 on 2025-02-12 18:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('proposal', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='History',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(blank=True, choices=[('1', 'Aberto'), ('2', 'Aguardando Digitação'), ('3', 'Pendente Pré-digitação'), ('4', 'Pendente Formalização'), ('5', 'Aguardando Averbação'), ('6', 'Aguardando retorno CIP'), ('7', 'Pendente envio CIP'), ('8', 'Saldo Informado Aguardando Pagamento'), ('9', 'Aguardando Atuação Operacional'), ('10', 'Pendente CIP'), ('11', 'Pago'), ('12', 'Pagamento Devolvido'), ('13', 'Comissão Processada'), ('14', 'Cancelado'), ('15', 'Cancelamento Solicitado Pelo Parceiro'), ('16', 'Clonado'), ('17', 'Aguardando Portabilidade'), ('18', 'Pendente'), ('19', 'Andamento')], max_length=200, null=True)),
                ('obs', models.TextField(blank=True, null=True)),
                ('proposal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='proposal', to='proposal.proposal')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
