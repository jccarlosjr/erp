from django.contrib import admin
from .models import Simulation, Installment


@admin.register(Simulation)
class SimulationAdmin(admin.ModelAdmin):
    list_display = ('internal_code', 'date', 'user', 'cpf', 'last_update', 'status')


@admin.register(Installment)
class InstallmentAdmin(admin.ModelAdmin):
    list_display = ('installment', 'operation')
