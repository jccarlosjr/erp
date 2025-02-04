from django import forms
from .models import Dispatch
from proposal.forms import Proposal

class DispatchForm(forms.ModelForm):
    class Meta:
        model = Dispatch
        fields = ['date', 'user', 'production', 'comission', 'deduction', 'proposals']

    proposals = forms.ModelMultipleChoiceField(
        queryset=Proposal.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False 
    )