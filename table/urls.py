from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/table/', views.TableCreateListView.as_view(), name='table-create-list'),
    path('api/v1/table/operation/<int:operation_id>/', views.TableByOperationListView.as_view(), name='table-by-operation'),
    path('api/v1/table/<int:pk>/', views.TableRetrieveUpdateDestroyView.as_view(), name='table-detail-view'),
    path('api/v1/table/operation/<int:operation_id>/bank/<int:bank_id>/', views.TableByOperationAndBankListView.as_view(), name='table-by-operation-and-bank'),

    path('tables/operation', views.TablesByOperationListView.as_view(), name='tables_by_operation'),
    path('tables/operation/<int:pk>/', views.TablesByOperationDetailView.as_view(), name='tables_by_operation_detail'),

    path('tables/bank/operation/<int:pk>', views.TablesByOperationDetailView.as_view(), name='tables_by_operation'),
    path('tables/bank/operation/<int:operation_id>/create-table/', views.TableCreateView.as_view(), name='create_table'),
    path('table/<int:pk>/update', views.TableUpdateView.as_view(), name='update_table'),
    path('table/<int:pk>/delete/', views.TableDeleteView.as_view(), name='delete_table'),
]
