from rest_framework import generics
from django.urls import reverse_lazy
from .models import Table
from operation.models import Operation
from .serializers import TableSerializer, TableDetailSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.mixins import LoginRequiredMixin
from accounts.mixins import UserRoleRequiredMixin
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from app.permissions import GlobalDefaultPermission
from .forms import TableForm, TableUpdateForm


class TableCreateListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Table.objects.all()
    serializer_class = TableSerializer


class TableRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Table.objects.all()
    serializer_class = TableSerializer


class TableByOperationListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    serializer_class = TableSerializer
    queryset = Operation.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TableDetailSerializer
        return TableSerializer

    def get_queryset(self):
        operation_id = self.kwargs['operation_id']
        return Table.objects.filter(operation__id=operation_id)


class TableByOperationAndBankListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    serializer_class = TableSerializer
    queryset = Table.objects.all()

    def get_queryset(self):
        operation_id = self.kwargs['operation_id']
        bank_id = self.kwargs['bank_id']
        return self.queryset.filter(operation__id=operation_id, bank__id=bank_id)


class TablesByOperationListView(UserRoleRequiredMixin, LoginRequiredMixin, ListView):
    model = Operation
    template_name = 'tables_by_operation.html'
    context_object_name = 'operations'
    allowed_roles = ['operacional', 'admin']


class TablesByOperationDetailView(UserRoleRequiredMixin, LoginRequiredMixin, DetailView):
    model = Operation
    template_name = 'tables.html'
    context_object_name = 'operation'
    allowed_roles = ['operacional', 'admin']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        search = self.request.GET.get('search')

        if search:
            tables = Table.objects.filter(operation=self.object, bank__name__icontains=search)
        else:
            tables = Table.objects.filter(operation=self.object)

        context['tables'] = tables
        return context


class TableCreateView(UserRoleRequiredMixin, LoginRequiredMixin, CreateView):
    model = Table
    template_name = 'table_create.html'
    form_class = TableForm
    context_object_name = 'tables'
    allowed_roles = ['operacional', 'admin']

    def form_valid(self, form):
        operation = get_object_or_404(Operation, pk=self.kwargs['operation_id'])
        form.instance.operation = operation
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('tables_by_operation', kwargs={'pk': self.kwargs['operation_id']})


class TableUpdateView(UserRoleRequiredMixin, LoginRequiredMixin, UpdateView):
    model = Table
    template_name = 'table_update.html'
    form_class = TableUpdateForm
    allowed_roles = ['operacional', 'admin']

    def get_success_url(self):
        return reverse_lazy('tables_by_operation', kwargs={'pk': self.object.operation.pk})


class TableDeleteView(UserRoleRequiredMixin, LoginRequiredMixin, DeleteView):
    model = Table
    template_name = 'Table_delete.html'
    success_url = reverse_lazy('tables_by_bank')
    allowed_roles = ['operacional', 'admin']
