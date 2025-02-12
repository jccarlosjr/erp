from .models import CustomUser
from django import forms
from company.models import Room

class UserForm(forms.ModelForm):

    class Meta:
        model = CustomUser
        fields = '__all__'

class UserFormNew(forms.ModelForm):
    class Meta:
        model = CustomUser
        exclude = ['company']

        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'type': 'number', 'required': 'required'}),
            'room': forms.Select(attrs={'class': 'form-select form-select-sm', 'required': 'required'}),
            'role': forms.Select(attrs={'class': 'form-select form-select-sm', 'required': 'required'}),
            'first_name': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'required': 'required'}),
            'email': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'required': 'required'}),
            'password': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'type':'password', 'required': 'required'}),
            'groups': forms.SelectMultiple(attrs={'class': 'form-select form-select-sm', 'required': 'required'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input', 'required': 'required'}),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None) 
        super().__init__(*args, **kwargs)

        if user and user.company:
            self.fields['room'].queryset = Room.objects.filter(company=user.company)
        else:
            self.fields['room'].queryset = Room.objects.none()



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

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None) 
        super().__init__(*args, **kwargs)

        if user and user.company:
            self.fields['room'].queryset = Room.objects.filter(company=user.company)
        else:
            self.fields['room'].queryset = Room.objects.none()
