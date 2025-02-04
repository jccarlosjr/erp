from rest_framework import generics
from .models import History
from proposal.models import Proposal
from .serializers import HistorySerializer, HistoryDetailSerializer
from rest_framework.permissions import IsAuthenticated
from app.permissions import GlobalDefaultPermission
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin


class HistoryCreateListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = History.objects.all()
    serializer_class = HistorySerializer


class HistoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = History.objects.all()
    serializer_class = HistorySerializer


class HistoryByProposalListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    serializer_class = HistoryDetailSerializer
    queryset = History.objects.all()

    def get_queryset(self):
        proposal_id = self.kwargs['pk']
        return History.objects.filter(proposal__id=proposal_id).order_by('-id')


class HistoryByProposalTemplateView(LoginRequiredMixin, TemplateView):
    template_name = 'historic.html'

    def get_context_data(self, **kwargs):
            context = super().get_context_data(**kwargs)
            proposal_id = self.kwargs['pk']
            proposal = Proposal.objects.get(id=proposal_id)
            context['proposal'] = proposal
            context['historys'] = History.objects.filter(proposal__id=proposal_id)
            return context
