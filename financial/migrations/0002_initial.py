# Generated by Django 5.1.1 on 2025-02-12 18:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('financial', '0001_initial'),
        ('proposal', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='dispatch',
            name='proposals',
            field=models.ManyToManyField(blank=True, related_name='dispatches', to='proposal.proposal'),
        ),
        migrations.AddField(
            model_name='dispatch',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='dispatch', to=settings.AUTH_USER_MODEL),
        ),
    ]
