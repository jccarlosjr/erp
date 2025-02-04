from .models import CustomUser
from django import forms

class UserForm(forms.ModelForm):

    class Meta:
        model = CustomUser
        fields = '__all__'

class UserFormNew(forms.ModelForm):

    class Meta:
        model = CustomUser
        fields = '__all__'

        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'type': 'number', 'required': 'required'}),
            'company': forms.Select(attrs={'class': 'form-select form-select-sm', 'required': 'required'}),
            'room': forms.Select(attrs={'class': 'form-select form-select-sm', 'required': 'required'}),
            'role': forms.Select(attrs={'class': 'form-select form-select-sm', 'required': 'required'}),
            'first_name': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'required': 'required'}),
            'email': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'required': 'required'}),
            'password': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'type':'password', 'required': 'required'}),
            'groups': forms.SelectMultiple(attrs={'class': 'form-select form-select-sm', 'required': 'required'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input', 'required': 'required'}),
        }

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'email', 'room', 'role', 'groups']

        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'required': 'required'}),
            'email': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'required': 'required'}),
            'room': forms.Select(attrs={'class': 'form-select form-select-sm', 'required': 'required'}),
            'role': forms.Select(attrs={'class': 'form-select form-select-sm', 'required': 'required'}),
            'groups': forms.SelectMultiple(attrs={'class': 'form-select form-select-sm', 'required': 'required'}),
        }
