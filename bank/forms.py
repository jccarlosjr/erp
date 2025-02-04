from .models import Bank
from django import forms

class BankForm(forms.ModelForm):

    class Meta:
        model = Bank
        fields = '__all__'
