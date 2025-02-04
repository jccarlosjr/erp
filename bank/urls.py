from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/bank/', views.BankAPICreateListView.as_view(), name='bank-create-list'),
    path('api/v1/bank/<int:pk>/', views.BankAPIRetrieveUpdateDestroyView.as_view(), name='bank-detail-view'),

    path('bank/list', views.BankListView.as_view(), name='bank_list'),
    path('bank/create', views.BankCreateView.as_view(), name='bank_create'),
    path('bank/<int:pk>/update', views.BankUpdateView.as_view(), name='bank_update'),
    path('bank/<int:pk>/delete', views.BankDeleteView.as_view(), name='bank_delete'),
]
