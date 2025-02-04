from rest_framework import serializers
from .models import Dispatch, Proposal
from accounts.serializers import UserDetailSerializer
from proposal.serializers import ProposalADESerializer

class DispatchSerializer(serializers.ModelSerializer):
    proposals = serializers.PrimaryKeyRelatedField(queryset=Proposal.objects.all(), many=True, required=False)

    class Meta:
        model = Dispatch
        fields = '__all__'

    def create(self, validated_data):
        proposals_data = validated_data.pop('proposals', [])
        dispatch = Dispatch.objects.create(**validated_data)

        dispatch.proposals.set(proposals_data)
        dispatch.save()
        return dispatch

    def update(self, instance, validated_data):
        proposals_data = validated_data.pop('proposals', [])
        instance = super().update(instance, validated_data)

        instance.proposals.set(proposals_data)
        instance.save()
        return instance


class DispatchUpdateSerializer(serializers.ModelSerializer):
    proposals = serializers.PrimaryKeyRelatedField(queryset=Proposal.objects.all(), many=True, required=False)
    user_object = UserDetailSerializer(source='user', read_only=True)
    proposal_object = ProposalADESerializer(source='proposals', many=True, read_only=True)

    class Meta:
        model = Dispatch
        fields = [
            'internal_code',
            'date',
            'user',
            'production',
            'bonification',
            'total_comission',
            'deduction',
            'comission',
            'proposals',
            'user_object',
            'proposal_object'
        ]
