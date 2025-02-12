from rest_framework import serializers
from .models import Installment, Simulation


class InstallmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Installment
        fields = '__all__'


class SimulationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Simulation
        fields = '__all__'
