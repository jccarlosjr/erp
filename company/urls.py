from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/company/', views.CompanyAPICreateListView.as_view(), name='company-create-list'),
    path('api/v1/company/<int:pk>/', views.CompanyAPIRetrieveUpdateDestroyView.as_view(), name='company-detail-view'),
    path('api/v1/room/', views.RoomAPICreateListView.as_view(), name='room-create-list'),
    path('api/v1/room/<int:pk>/', views.RoomAPIRetrieveUpdateDestroyView.as_view(), name='room-detail-view'),

    path('room/list/', views.RoomListView.as_view(), name="room_list"),
    path('room/create/', views.RoomCreateView.as_view(), name="room_create"),
    path('room/<int:pk>/update', views.RoomUpdateView.as_view(), name='room_update'),
    path('room/<int:pk>/delete', views.RoomDeleteView.as_view(), name='room_delete'),
]
