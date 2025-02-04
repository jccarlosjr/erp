from .models import Room, Company
from django import forms

class RoomForm(forms.ModelForm):

    class Meta:
        model = Room
        fields = '__all__'


class RoomFormCreate(forms.ModelForm):
    class Meta:
        model = Room
        fields = ['name']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'required': 'required'}),
        }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('customuser', None)
        super().__init__(*args, **kwargs)

    def save(self, commit=True):
        room = super().save(commit=False)
        if self.user:
            room.company = self.user.company
        if commit:
            room.save()
        return room



class RoomFormUpdate(forms.ModelForm):
    class Meta:
        model = Room
        fields = ['name']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'required': 'required'}),
        }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

        if self.user:
            self.fields['name'].queryset = Room.objects.filter(company=self.user.company)

