from rest_framework import generics
from django.urls import reverse_lazy
from .serializers import BankSerializer
from rest_framework.permissions import IsAuthenticated
from app.permissions import GlobalDefaultPermission
from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from accounts.mixins import UserRoleRequiredMixin
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from .models import Bank
from .forms import BankForm


class AdminRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_superuser


class BankAPICreateListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Bank.objects.all()
    serializer_class = BankSerializer


class BankAPIRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Bank.objects.all()
    serializer_class = BankSerializer


class BankListView(UserRoleRequiredMixin, LoginRequiredMixin, ListView):
    model = Bank
    template_name = 'bank_list.html'
    context_object_name = 'banks'
    allowed_roles = ['operacional', 'admin']


class BankCreateView(UserRoleRequiredMixin, LoginRequiredMixin, CreateView):
    model = Bank
    form_class = BankForm
    template_name = 'bank_create.html'
    success_url = reverse_lazy('bank_list')
    allowed_roles = ['operacional', 'admin']


class BankUpdateView(UserRoleRequiredMixin, LoginRequiredMixin, UpdateView):
    model = Bank
    template_name = 'bank_update.html'
    form_class = BankForm
    context_object_name = 'banks'
    success_url = reverse_lazy('bank_list')
    allowed_roles = ['operacional', 'admin']


class BankDeleteView(UserRoleRequiredMixin, LoginRequiredMixin, DeleteView):
    model = Bank
    template_name = 'bank_delete.html'
    success_url = reverse_lazy('bank_list')
    allowed_roles = ['operacional', 'admin']
