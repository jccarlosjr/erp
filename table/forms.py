from .models import Table
from django import forms

class TableForm(forms.ModelForm):

    class Meta:
        model = Table
        fields = ['name', 'bank','coefficient', 'rate', 'term', 'cms', 'cms_type']

        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'maxlength': '200'}),
            'bank': forms.Select(attrs={'class': 'form-select form-select-sm'}),
            'coefficient': forms.TextInput(attrs={'class': 'form-control form-control-sm'}),
            'rate': forms.NumberInput(attrs={'class': 'form-control form-control-sm'}),
            'term': forms.NumberInput(attrs={'class': 'form-control form-control-sm'}),
            'cms': forms.TextInput(attrs={'class': 'form-control form-control-sm'}),
            'cms_type': forms.Select(attrs={'class': 'form-select form-select-sm'})
        }


class TableUpdateForm(forms.ModelForm):

    class Meta:
        model = Table
        fields = ['name', 'coefficient', 'rate', 'term', 'cms', 'cms_type']

        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'maxlength': '200'}),
            'coefficient': forms.TextInput(attrs={'class': 'form-control form-control-sm'}),
            'rate': forms.NumberInput(attrs={'class': 'form-control form-control-sm'}),
            'term': forms.NumberInput(attrs={'class': 'form-control form-control-sm'}),
            'cms': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'type': 'number'}),
            'cms_type': forms.Select(attrs={'class': 'form-select form-select-sm'})
        }