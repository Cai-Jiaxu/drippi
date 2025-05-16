# urls.py determines where the HTTP request travels to (which views handles it)
# core/urls.py means all the stuff in core is for the outfit renting
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    LoginView,
    MeView,
    LogoutView,
    UserViewSet,
    ProfileViewSet,
    CategoryViewSet,
    OutfitViewSet,
    OutfitImageViewSet,
    RentalViewSet,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'outfits', OutfitViewSet)
router.register(r'images', OutfitImageViewSet)
router.register(r'rentals', RentalViewSet)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/',    LoginView.as_view(),    name='login'),
    path('auth/me/',       MeView.as_view(),       name='me'),
    path('auth/logout/',   LogoutView.as_view(),   name='logout'),
    path('', include(router.urls)),
]

