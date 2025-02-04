from django.contrib import admin
from .models import Proposal


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ['internal_code', 'user__username', 'cpf', 'table__operation', 'table__bank', 'status', 'user__room']
    search_fields = ['internal_code', 'cpf', 'status']
