from rest_framework import serializers
from .models import CustomUser
from company.serializers import CompanySerializer, RoomSerializer


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = '__all__'


class UserDetailSerializer(serializers.ModelSerializer):
    room_object = RoomSerializer(source='room', read_only=True)
    company_object = CompanySerializer(source='company', read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'username',
            'first_name',
            'email',
            'room_object',
            'company_object',
        ]
