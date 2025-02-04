from django.contrib import admin
from .models import Dispatch


@admin.register(Dispatch)
class DispatchAdmin(admin.ModelAdmin):
    list_display = ['internal_code', 'date', 'user__username', 'user__room', 'user__company', 'production', 'comission', 'deduction']
    search_fields = ['internal_code', 'date', 'user__username', 'user__room', 'user__company']
