
from accounts.views import LoginView, HomeView
from django.contrib.auth import views as auth_view
from . import views
from django.urls import path    


urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', auth_view.LogoutView.as_view(), name='logout'),

    path('api/v1/user/filter/', views.UserListAPIView.as_view(), name='user-filter-view'),
    path('api/v1/user/<int:pk>/', views.UserAPIRetrieveUpdateDestroyView.as_view(), name='user-detail-view'),

    path('users/list/', views.UserListView.as_view(), name='user_list'),
    path('users/create/', views.UserCreateView.as_view(), name='user_create'),
    path('users/<int:pk>/update/', views.UserUpdateView.as_view(), name='user_update'),
    path('users/<int:pk>/password_change/', views.ForcePasswordResetView.as_view(), name='user_password_change'),
]