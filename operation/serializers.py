from rest_framework import serializers
from .models import Operation
from bank.serializers import BankSerializer


class OperationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Operation
        fields = '__all__'


class OperationDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Operation
        fields = ['id', 'name']
