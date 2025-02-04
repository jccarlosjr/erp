from rest_framework import generics
from .models import Operation
from bank.models import Bank
from .forms import OperationForm
from django.urls import reverse_lazy
from .serializers import OperationSerializer, OperationDetailSerializer
from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from accounts.mixins import UserRoleRequiredMixin
from rest_framework.permissions import IsAuthenticated
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from app.permissions import GlobalDefaultPermission


class AdminRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_superuser


class OperationCreateListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Operation.objects.all()
    serializer_class = OperationSerializer


class OperationRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Operation.objects.all()
    serializer_class = OperationSerializer


class OperationListView(UserRoleRequiredMixin, LoginRequiredMixin, ListView):
    model = Operation
    template_name = 'operation_list.html'
    context_object_name = 'operations'
    allowed_roles = ['operacional', 'admin']


class OperationCreateView(UserRoleRequiredMixin, LoginRequiredMixin, CreateView):
    model = Operation
    form_class = OperationForm
    template_name = 'operation_create.html'
    success_url = reverse_lazy('operation_list')
    allowed_roles = ['operacional', 'admin']


class OperationUpdateView(UserRoleRequiredMixin, LoginRequiredMixin, UpdateView):
    model = Operation
    template_name = 'operation_update.html'
    form_class = OperationForm
    context_object_name = 'operations'
    success_url = reverse_lazy('operation_list')
    allowed_roles = ['operacional', 'admin']


class OperationDeleteView(UserRoleRequiredMixin, LoginRequiredMixin, DeleteView):
    model = Operation
    template_name = 'operation_delete.html'
    success_url = reverse_lazy('operation_list')
    allowed_roles = ['operacional', 'admin']
