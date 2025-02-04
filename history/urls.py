from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/history/', views.HistoryCreateListView.as_view(), name='history-create-list'),
    path('api/v1/history/<int:pk>/', views.HistoryRetrieveUpdateDestroyView.as_view(), name='history-detail-view'),
    path('api/v1/history/proposal/<int:pk>/', views.HistoryByProposalListView.as_view(), name='history-proposal-view'),
    path('proposal/<int:pk>/history/', views.HistoryByProposalTemplateView.as_view(), name='history_proposal_view'),
]
