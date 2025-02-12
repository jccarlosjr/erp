from ast import ClassDef
from rest_framework import generics
from django.urls import reverse_lazy
from .serializers import InstallmentSerializer, SimulationSerializer
from rest_framework.permissions import IsAuthenticated
from app.permissions import GlobalDefaultPermission
from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from accounts.mixins import UserRoleRequiredMixin
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from .models import Installment, Simulation
from .forms import SimulationForm, InstallmentForm
from django.db.models import Q



class InstallmentAPICreateListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Installment.objects.all()
    serializer_class = InstallmentSerializer


class InstallmentAPIRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Installment.objects.all()
    serializer_class = InstallmentSerializer

class SimulationAPICreateListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Simulation.objects.all()
    serializer_class = SimulationSerializer


class SimulationAPIRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Simulation.objects.all()
    serializer_class = SimulationSerializer


class SimulationsView(LoginRequiredMixin, ListView):
    model = Simulation
    template_name = 'simulations.html'
    context_object_name = 'simulations'

    def get_queryset(self):
        user = self.request.user
        base_queryset = super().get_queryset().order_by('last_update')

        if user.role == 'vendedor':
            simulation = base_queryset.filter(user=user)
        elif user.role in ['supervisor', 'gestor']:
            simulation = base_queryset.filter(user__room=user.room)
        elif user.role in ['operacional', 'admin']:
            simulation = base_queryset.filter(user__company=user.company)

        search_type = self.request.GET.get('search_type', '').strip()
        search_value = self.request.GET.get('search_value', '').strip()

        if search_type and search_value:
            filters = Q()
            if search_type == 'internal_code':
                filters &= Q(internal_code=search_value)
            elif search_type == 'cpf':
                filters &= Q(cpf=search_value)
            simulation = simulation.filter(filters)

        return simulation


class SimulationUpdateView(UserRoleRequiredMixin, LoginRequiredMixin, UpdateView):
    model = Simulation
    template_name = 'simulation_update.html'
    form_class = SimulationForm
    success_url = reverse_lazy('simulations')
    allowed_roles = ['operacional', 'admin', 'gestor', 'supervisor']


class SimulationDetailView(LoginRequiredMixin, DetailView):
    model = Simulation
    template_name = 'simulation_detail.html'
