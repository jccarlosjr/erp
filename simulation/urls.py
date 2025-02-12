from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/installment/', views.InstallmentAPICreateListView.as_view(), name='installment-create-list'),
    path('api/v1/installment/<int:pk>/', views.InstallmentAPIRetrieveUpdateDestroyView.as_view(), name='installment-detail-view'),
    path('api/v1/simulation/', views.SimulationAPICreateListView.as_view(), name='simulation-create-list'),
    path('api/v1/simulation/<int:pk>/', views.SimulationAPIRetrieveUpdateDestroyView.as_view(), name='simulation-detail-view'),

    path('simulations/', views.SimulationsView.as_view(), name='simulations'),
    path('simulation/<int:pk>/update/', views.SimulationUpdateView.as_view(), name='simulation_update'),
    path('simulation/<int:pk>/detail/', views.SimulationDetailView.as_view(), name='simulation_detail'),
]
