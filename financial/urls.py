from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/dispatch/', views.DispatchAPICreateListView.as_view(), name='dispatch-create-list'),
    path('api/v1/dispatch/<int:pk>/', views.DispatchAPIRetrieveUpdateDestroyView.as_view(), name='dispatch-detail-view'),

    path('dispatch/list/', views.DispatchListView.as_view(), name='dispatch_list'),
    path('dispatch/list/corretor/', views.DispatchUserListView.as_view(), name='dispatch_list_corretor'),
    path('dispatch/create/', views.DispatchCreateView.as_view(), name='dispatch_create'),
    path('dispatch/<int:pk>/detail/', views.DispatchDetailView.as_view(), name='dispatch_detail'),
    path('dispatch/<int:pk>/update/', views.DispatchUpdateView.as_view(), name='dispatch_update'),
    path('dispatch/<int:pk>/delete/', views.DispatchDeleteView.as_view(), name='dispatch_delete'),

    path('production/', views.ProductionListView.as_view(), name='production_view'),
]
