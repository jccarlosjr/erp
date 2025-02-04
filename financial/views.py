from rest_framework import generics
from django.urls import reverse_lazy
from rest_framework.permissions import IsAuthenticated
from app.permissions import GlobalDefaultPermission
from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from accounts.mixins import UserRoleRequiredMixin
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView, TemplateView
from .models import Dispatch
from .forms import DispatchForm
from .serializers import DispatchSerializer, DispatchUpdateSerializer
from django.db.models import Q



class AdminRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_superuser


class DispatchAPICreateListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission)
    queryset = Dispatch.objects.all()
    serializer_class = DispatchSerializer


class DispatchAPIRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Dispatch.objects.all()
    serializer_class = DispatchUpdateSerializer


class DispatchListView(UserRoleRequiredMixin, LoginRequiredMixin, ListView):
    model = Dispatch
    template_name = 'dispatch_list.html'
    context_object_name = 'dispatchs'
    allowed_roles = ['operacional', 'admin']

    def get_queryset(self):
        user = self.request.user
        base_queryset = super().get_queryset().order_by('-id')

        if user.role == 'vendedor':
            dispatch = base_queryset.filter(user=user)
        elif user.role == 'supervisor':
            dispatch = base_queryset.filter(user__room=user.room)
        elif user.role in ['gestor', 'operacional', 'admin']:
            dispatch = base_queryset.filter(user__company=user.company)

        dispatch = dispatch.order_by('-id')

        search_type = self.request.GET.get('search_type', '').strip()
        search_value = self.request.GET.get('search_value', '').strip()

        if search_type and search_value:
            filters = Q()
            if search_type == 'internal_code':
                filters &= Q(internal_code=search_value)
            elif search_type == 'user':
                filters &= Q(user=search_value)
            elif search_type == 'proposals':
                filters &= Q(proposals__internal_code=search_value)
            elif search_type == 'ade':
                filters &= Q(proposals__ade=search_value)
            elif search_type == 'cpf':
                filters &= Q(proposals__cpf=search_value)
            elif search_type == 'name':
                filters &= Q(proposals__name=search_value)
            dispatch = dispatch.filter(filters)

        return dispatch


class DispatchCreateView(UserRoleRequiredMixin, LoginRequiredMixin, CreateView):
    model = Dispatch
    form_class = DispatchForm
    template_name = 'dispatch_create.html'
    success_url = reverse_lazy('dispatch_list')
    allowed_roles = ['operacional', 'admin']


class DispatchDetailView(LoginRequiredMixin, DetailView):
    model = Dispatch
    template_name = 'dispatch_detail.html'


class DispatchUpdateView(UserRoleRequiredMixin, LoginRequiredMixin, UpdateView):
    model = Dispatch
    template_name = 'dispatch_update.html'
    form_class = DispatchForm
    context_object_name = 'dispatchs'
    success_url = reverse_lazy('dispatch_list')
    allowed_roles = ['operacional', 'admin']


class DispatchDeleteView(UserRoleRequiredMixin, LoginRequiredMixin, DeleteView):
    model = Dispatch
    template_name = 'dispatch_delete.html'
    success_url = reverse_lazy('dispatch_list')
    allowed_roles = ['operacional', 'admin']


class DispatchUserListView(LoginRequiredMixin, ListView):
    model = Dispatch
    template_name = 'dispatch_list_corretor.html'
    context_object_name = 'dispatchs'


    def get_queryset(self):
        user = self.request.user
        base_queryset = super().get_queryset().filter(user=user).order_by('-id')

        if user.role == 'vendedor':
            dispatch = base_queryset.filter(user=user)
        elif user.role == 'supervisor':
            dispatch = base_queryset.filter(user__room=user.room)
        elif user.role in ['gestor', 'operacional', 'admin']:
            dispatch = base_queryset.filter(user__company=user.company)

        search_type = self.request.GET.get('search_type', '').strip()
        search_value = self.request.GET.get('search_value', '').strip()

        if search_type and search_value:
            filters = Q()
            if search_type == 'internal_code':
                filters &= Q(internal_code=search_value)
            elif search_type == 'user':
                filters &= Q(user=search_value)
            elif search_type == 'proposals':
                filters &= Q(proposals=search_value)
            dispatch = dispatch.filter(filters)

        return dispatch


class ProductionListView(UserRoleRequiredMixin, LoginRequiredMixin, TemplateView):
    template_name = 'production.html'
    allowed_roles = ['operacional', 'admin']