from .models import Operation
from django import forms

class OperationForm(forms.ModelForm):

    class Meta:
        model = Operation
        fields = '__all__'