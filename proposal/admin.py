from django.contrib import admin
from .models import Proposal, ProposalFile


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ['internal_code', 'user__username', 'cpf', 'table__operation', 'table__bank', 'status', 'user__room']
    search_fields = ['internal_code', 'cpf', 'status']


@admin.register(ProposalFile)
class ProposalFileAdmin(admin.ModelAdmin):
    list_display = ['proposal__internal_code', 'file',  'file_type', 'uploaded_by']
    search_fields = ['file', 'proposal__internal_code', 'uploaded_by']
