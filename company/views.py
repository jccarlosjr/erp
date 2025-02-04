from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from app.permissions import GlobalDefaultPermission
from .models import Company, Room
from .forms import RoomForm, RoomFormUpdate, RoomFormCreate
from accounts.mixins import UserRoleRequiredMixin
from django.urls import reverse_lazy
from .serializers import CompanySerializer, RoomSerializer
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin


class CompanyAPICreateListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_queryset(self):
        user = self.request.user

        base_queryset = super().get_queryset().order_by('-id')

        if user.role == 'vendedor':
            return base_queryset.filter(id=user.room.id)
        elif user.role == 'supervisor':
            return base_queryset.filter(id=user.room.id)
        elif user.role == 'gestor':
            return base_queryset.filter(id=user.company.id)
        elif user.role in ['operacional', 'admin']:
            return base_queryset.filter(company=user.company.id)
        else:
            return Company.objects.none()


class CompanyAPIRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class RoomAPICreateListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get_queryset(self):
        user = self.request.user

        base_queryset = super().get_queryset().order_by('-id')

        if user.role == 'vendedor':
            return base_queryset.filter(id=user.room.id)
        elif user.role == 'supervisor':
            return base_queryset.filter(id=user.room.id)
        elif user.role == 'gestor':
            return base_queryset.filter(id=user.company.id)
        elif user.role in ['operacional', 'admin']:
            return base_queryset.filter(company=user.company.id)
        else:
            return Room.objects.none()


class RoomAPIRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class RoomListView(UserRoleRequiredMixin, LoginRequiredMixin, ListView):
    template_name = "room_list.html"
    model = Room
    context_object_name = "rooms"
    allowed_roles = ['operacional', 'admin']

    def get_queryset(self):
        user = self.request.user
        base_queryset = super().get_queryset().filter(company=user.company).order_by('-id')
        return base_queryset


class RoomCreateView(UserRoleRequiredMixin, LoginRequiredMixin, CreateView):
    template_name = "room_create.html"
    model = Room
    form_class = RoomFormCreate
    success_url = reverse_lazy('room_list')
    allowed_roles = ['operacional', 'admin']

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['customuser'] = self.request.user  # Passa o usuário corretamente
        return kwargs


class RoomUpdateView(UserRoleRequiredMixin, LoginRequiredMixin, UpdateView):
    model = Room
    template_name = 'room_update.html'
    form_class = RoomFormUpdate
    context_object_name = 'room'
    success_url = reverse_lazy('room_list')
    allowed_roles = ['operacional', 'admin']

    def get_queryset(self):
        user = self.request.user
        return super().get_queryset().filter(company=user.company)

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs


class RoomDeleteView(UserRoleRequiredMixin, LoginRequiredMixin, DeleteView):
    model = Room
    template_name = 'room_delete.html'
    success_url = reverse_lazy('room_list')
    allowed_roles = ['operacional', 'admin']