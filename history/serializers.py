from rest_framework import serializers
from .models import History
from proposal.serializers import ProposalSerializer

class HistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = History
        fields = '__all__'


class HistoryDetailSerializer(serializers.ModelSerializer):
    proposal = ProposalSerializer()
    status_display = serializers.SerializerMethodField()
    user_username = serializers.CharField(source='user.username', read_only=True)  # Adiciona o username

    class Meta:
        model = History()
        fields = ['proposal', 'user_username', 'date', 'status_display', 'obs']

    def get_status_display(self, obj):
        return obj.get_status_display()