from .models import Installment, Simulation
from django import forms


class InstallmentForm(forms.ModelForm):

    class Meta:
        model = Installment
        fields = '__all__'


class SimulationForm(forms.ModelForm):

    class Meta:
        model = Simulation
        fields = '__all__'
