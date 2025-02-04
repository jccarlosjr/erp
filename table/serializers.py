from rest_framework import serializers
from .models import Table
from operation.serializers import OperationSerializer, OperationDetailSerializer
from bank.serializers import BankSerializer


class TableSerializer(serializers.ModelSerializer):

    class Meta:
        model = Table
        fields = '__all__'


class TableDetailSerializer(serializers.ModelSerializer):
    operation = OperationDetailSerializer()
    bank_object = BankSerializer(source='bank', read_only=True)

    class Meta:
        model = Table
        fields = ['id', 'name', 'operation', 'bank', 'coefficient', 'rate', 'term', 'bank_object', 'cms', 'cms_type']
