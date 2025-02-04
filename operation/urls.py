from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/operation/', views.OperationCreateListView.as_view(), name='operation-create-list'),
    path('api/v1/operation/<int:pk>/', views.OperationRetrieveUpdateDestroyView.as_view(), name='operation-detail-view'),

    path('operation/list/', views.OperationListView.as_view(), name='operation_list'),
    path('operation/create/', views.OperationCreateView.as_view(), name='operation_create'),
    
    path('operation/<int:pk>/update/', views.OperationUpdateView.as_view(), name='operation_update'),
    path('operation/<int:pk>/delete/', views.OperationDeleteView.as_view(), name='operation_delete'),
]
