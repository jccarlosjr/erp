from rest_framework import generics
from .models import Customer
from django.views.generic import TemplateView, ListView, UpdateView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from accounts.mixins import UserRoleRequiredMixin
from .serializers import CustomerSerializer
from rest_framework.permissions import IsAuthenticated
from app.permissions import GlobalDefaultPermission
from rest_framework.response import Response
from rest_framework import status


class CustomerCreateListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def create(self, request, *args, **kwargs):
        cpf = request.data.get('cpf')

        customer, created = Customer.objects.update_or_create(
            cpf=cpf,
            defaults=request.data
        )

        if created:
            return Response({'id': customer.id}, status=status.HTTP_201_CREATED)
        else:
            return Response({'id': customer.id}, status=status.HTTP_200_OK)


class CustomerByCPFView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def get(self, request, *args, **kwargs):
        cpf = self.kwargs.get('cpf')
        try:
            customer = Customer.objects.get(cpf=cpf)
            serializer = self.serializer_class(customer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Customer.DoesNotExist:
            return Response({'detail': 'Cliente não encontrado.'}, status=status.HTTP_404_NOT_FOUND)


class CustomerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class CustomerListView(UserRoleRequiredMixin, LoginRequiredMixin, ListView):
    model = Customer
    template_name = 'customer_list.html'
    context_object_name = 'customers'
    paginate_by = 25
    allowed_roles = ['operacional', 'admin', 'supervisor', 'gestor']

    def get_queryset(self):
        customer = super().get_queryset().order_by('-id')

        search_type = self.request.GET.get('search_type')
        search_value = self.request.GET.get('search_value')

        if search_type and search_value:
            if search_type == 'cpf':
                customer = customer.filter(cpf=search_value)
            elif search_type == 'name':
                customer = customer.filter(cname__icontains=search_value)

        return customer
