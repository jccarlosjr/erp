# Generated by Django 5.1.1 on 2025-02-01 00:36

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('table', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Proposal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('cpf', models.CharField(max_length=14)),
                ('birthdate', models.DateField()),
                ('sex', models.CharField(max_length=10)),
                ('is_foreigner', models.CharField(blank=True, max_length=10, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('is_illiterate', models.CharField(blank=True, max_length=10, null=True)),
                ('rg', models.CharField(max_length=100)),
                ('rg_public_agency', models.CharField(max_length=20)),
                ('rg_uf', models.CharField(max_length=20)),
                ('rg_created_date', models.DateField()),
                ('naturality_city', models.CharField(max_length=50)),
                ('naturality_uf', models.CharField(max_length=20)),
                ('father', models.CharField(max_length=200)),
                ('mother', models.CharField(max_length=200)),
                ('telphone', models.CharField(max_length=15)),
                ('celphone', models.CharField(max_length=15)),
                ('postal_code', models.CharField(max_length=10)),
                ('city', models.CharField(max_length=200)),
                ('city_state', models.CharField(max_length=20)),
                ('district', models.CharField(max_length=200)),
                ('place', models.CharField(max_length=200)),
                ('complement', models.CharField(max_length=100)),
                ('house_number', models.CharField(max_length=20)),
                ('agency_id', models.IntegerField()),
                ('agency', models.CharField(max_length=10)),
                ('agency_code', models.CharField(max_length=200)),
                ('agency_uf', models.CharField(max_length=20)),
                ('agency_is_cm', models.CharField(max_length=3)),
                ('income', models.FloatField()),
                ('account_type', models.CharField(max_length=10)),
                ('account_bank', models.CharField(max_length=200)),
                ('account_agency', models.IntegerField()),
                ('account', models.IntegerField()),
                ('account_dv', models.IntegerField()),
                ('is_representated', models.CharField(default='NÃO', max_length=10)),
                ('rep_cpf', models.CharField(blank=True, max_length=14, null=True)),
                ('rep_name', models.CharField(blank=True, max_length=200, null=True)),
                ('ade', models.CharField(blank=True, max_length=50, null=True, unique=True)),
                ('is_blocked', models.BooleanField(blank=True, null=True)),
                ('internal_code', models.CharField(blank=True, max_length=200, null=True, unique=True)),
                ('installment', models.FloatField()),
                ('ballance', models.FloatField(blank=True, null=True)),
                ('total_amount', models.FloatField()),
                ('exchange', models.FloatField()),
                ('term', models.IntegerField()),
                ('term_paids', models.IntegerField(blank=True, null=True)),
                ('term_original', models.IntegerField(blank=True, null=True)),
                ('contract', models.CharField(blank=True, max_length=200, null=True)),
                ('original_bank', models.CharField(blank=True, max_length=200, null=True)),
                ('observation', models.TextField(blank=True, null=True)),
                ('status', models.CharField(blank=True, choices=[('1', 'Aberto'), ('2', 'Aguardando Digitação'), ('3', 'Pendente Pré-digitação'), ('4', 'Pendente Formalização'), ('5', 'Aguardando Averbação'), ('6', 'Aguardando retorno CIP'), ('7', 'Pendente envio CIP'), ('8', 'Saldo Informado Aguardando Pagamento'), ('9', 'Aguardando Atuação Operacional'), ('10', 'Pendente CIP'), ('11', 'Pago'), ('12', 'Pagamento Devolvido'), ('13', 'Comissão Processada'), ('14', 'Cancelado'), ('15', 'Cancelamento Solicitado Pelo Parceiro'), ('16', 'Clonado'), ('17', 'Aguardando Portabilidade'), ('18', 'Pendente'), ('19', 'Andamento')], max_length=200, null=True)),
                ('last_update', models.DateTimeField(auto_now=True, null=True)),
                ('is_clone', models.BooleanField(default=False)),
                ('is_cloned', models.BooleanField(default=False)),
                ('cloned_by', models.CharField(blank=True, max_length=200, null=True)),
                ('cms', models.FloatField(blank=True, default=0, null=True)),
                ('bound_proposal', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='bound_to', to='proposal.proposal')),
                ('table', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='proposal', to='table.table')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='proposal', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
