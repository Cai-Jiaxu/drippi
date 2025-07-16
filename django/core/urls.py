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
    OutfitImageUploadView,
    MyListingsView, 
    MyRentalsView,
    CancelRentalView,
    ApproveRentalView,
    RejectRentalView,
    UserProfileView,
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
    path('images/upload/', OutfitImageUploadView.as_view(), name='outfitimage-upload'),
    path('my-listings/', MyListingsView.as_view(), name='my-listings'),
    path('my-rentals/', MyRentalsView.as_view(), name='my-rentals'),
    path('cancel-rental/<int:rental_id>/', CancelRentalView.as_view(), name='cancel-rental'),
    path("approve-rental/<int:rental_id>/", ApproveRentalView.as_view(), name="approve-rental"),
    path('reject-rental/<int:rental_id>/', RejectRentalView.as_view(), name='reject-rental'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('', include(router.urls)),
]
