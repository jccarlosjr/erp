from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/customer/', views.CustomerCreateListView.as_view(), name='customer-create-list'),
    path('api/v1/customer/<int:pk>/', views.CustomerRetrieveUpdateDestroyView.as_view(), name='customer-detail-view'),
    path('api/v1/customer/cpf/<str:cpf>/', views.CustomerByCPFView.as_view(), name='customer-by-cpf'),

    path('customer/list', views.CustomerListView.as_view(), name="customer_list"),
]
