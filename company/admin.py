from django.contrib import admin
from .models import Company, Room


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'cnpj')


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'company')
