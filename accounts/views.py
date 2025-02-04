from django.shortcuts import render
from django.contrib.auth import views as auth_view
from django.contrib import messages
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.permissions import IsAuthenticated
from app.permissions import GlobalDefaultPermission
from rest_framework import generics
from django.views.generic import ListView, CreateView, UpdateView
from django.views.generic.edit import FormView
from django.shortcuts import get_object_or_404
from accounts.mixins import UserRoleRequiredMixin
from django.urls import reverse_lazy
from django.contrib.auth.forms import SetPasswordForm
from .forms import UserFormNew, UserUpdateForm
from .models import CustomUser
from .serializers import UserSerializer, UserDetailSerializer
from django.db.models import Q


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = 'home.html'


class LoginView(auth_view.LoginView):
    template_name = 'login.html'
    redirect_authenticated_user = True


class UserListAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    serializer_class = UserDetailSerializer
    queryset = CustomUser.objects.all()

    def get_queryset(self):
        user = self.request.user
        base_queryset = super().get_queryset().filter(company=user.company).order_by('-id')
        username = self.request.GET.get('username')
        if username:
            return base_queryset.filter(Q(username=username)).order_by('-id')
        return base_queryset


class UserAPIRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class UserListView(UserRoleRequiredMixin, LoginRequiredMixin, ListView):
    model = CustomUser
    template_name = 'user_list.html'
    context_object_name = 'users'
    allowed_roles = ['operacional', 'admin', 'gestor']

    def get_queryset(self):
        user = self.request.user
        base_queryset = super().get_queryset().filter(company=user.company).order_by('-id')
        username = self.request.GET.get('username')
        if username:
            return base_queryset.filter(Q(username=username)).order_by('-id')
        return base_queryset


class UserCreateView(UserRoleRequiredMixin, LoginRequiredMixin, CreateView):
    model = CustomUser
    form_class = UserFormNew
    template_name = 'user_create.html'
    success_url = reverse_lazy('user_list')
    allowed_roles = ['operacional', 'admin', 'gestor']


class UserUpdateView(UserRoleRequiredMixin, LoginRequiredMixin, UpdateView):
    model = CustomUser
    form_class = UserUpdateForm
    template_name = 'user_update.html'
    success_url = reverse_lazy('user_list')
    allowed_roles = ['admin', 'gestor', 'operacional']


class ForcePasswordResetView(UserRoleRequiredMixin, LoginRequiredMixin, FormView):
    template_name = 'user_password_change.html'
    form_class = SetPasswordForm
    success_url = reverse_lazy('user_list')
    allowed_roles = ['admin', 'gestor', 'operacional']

    def get_form(self):
        self.user = get_object_or_404(CustomUser, pk=self.kwargs['pk'])
        return self.form_class(user=self.user, **self.get_form_kwargs())

    def form_valid(self, form):
        form.save()
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['user'] = self.user
        return context
