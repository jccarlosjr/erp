from rest_framework import serializers
from .models import Proposal
from table.serializers import TableDetailSerializer
from accounts.serializers import UserSerializer, UserDetailSerializer



class ProposalSerializer(serializers.ModelSerializer):

    class Meta:
        model = Proposal
        fields = '__all__'


class ProposalDetailSerializer(serializers.ModelSerializer):
    table_object = TableDetailSerializer(source='table', read_only=True)
    bound_proposal_object = serializers.PrimaryKeyRelatedField(read_only=True)
    user_object = UserSerializer(source='user',read_only=True)

    class Meta:
        model = Proposal
        fields = [
            'id',
            'ade',
            'last_update',
            'internal_code',
            'user',
            'table',
            'installment',
            'ballance',
            'total_amount',
            'exchange',
            'term',
            'term_paids',
            'term_original',
            'contract',
            'original_bank',
            'observation',
            'status',
            'is_clone',
            'is_cloned',
            'cloned_by',
            'bound_proposal',
            'name',
            'cpf',
            'birthdate',
            'sex',
            'is_foreigner',
            'email',
            'is_illiterate',
            'rg',
            'rg_public_agency',
            'rg_uf',
            'rg_created_date',
            'naturality_city',
            'naturality_uf',
            'father',
            'mother',
            'telphone',
            'celphone',
            'postal_code',
            'city',
            'city_state',
            'district',
            'place',
            'complement',
            'house_number',
            'agency_id',
            'agency',
            'agency_code',
            'agency_uf',
            'agency_is_cm',
            'income',
            'account_type',
            'account_bank',
            'account_agency',
            'account',
            'account_dv',
            'is_representated',
            'rep_cpf',
            'rep_name',
            'is_blocked',
            'bound_proposal_object',
            'table_object',
            'cms',
            'user_object'
        ]


class ProposalFinancialSerializer(serializers.ModelSerializer):
    table_object = TableDetailSerializer(source='table', read_only=True)
    user_object = UserDetailSerializer(source='user',read_only=True)

    class Meta:
        model = Proposal
        fields = [
            'id',
            'cpf',
            'name',
            'status',
            'ade',
            'last_update',
            'internal_code',
            'user',
            'table',
            'installment',
            'ballance',
            'total_amount',
            'exchange',
            'term',
            'table_object',
            'cms',
            'user_object'
        ]


class ProposalADESerializer(serializers.ModelSerializer):
    user_object = UserSerializer(source='user', read_only=True)
    table_object = TableDetailSerializer(source='table', read_only=True)

    class Meta:
        model = Proposal
        fields = [
            'id',
            'ade',
            'internal_code',
            'installment',
            'total_amount',
            'exchange',
            'term',
            'status',
            'name',
            'cpf',
            'table_object',
            'user_object',
            'cms'
        ]