from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.contrib.auth.models import User
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile, Category, Outfit, OutfitImage, Rental
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ProfileSerializer,
    CategorySerializer,
    OutfitSerializer,
    OutfitImageSerializer,
    RentalSerializer,
)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        django_login(request, user)
        return Response({"username": user.username}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        django_login(request, user)
        return Response({"username": user.username}, status=status.HTTP_200_OK)

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({"username": request.user.username}, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        django_logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD for users.
    """
    queryset = User.objects.all().select_related("profile")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProfileViewSet(viewsets.ModelViewSet):
    """
    CRUD for profiles (gender).
    """
    queryset = Profile.objects.all().select_related("user")
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD for outfit categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class OutfitImageViewSet(viewsets.ModelViewSet):
    """
    CRUD for individual outfit images.
    """
    queryset = OutfitImage.objects.all().select_related("outfit")
    serializer_class = OutfitImageSerializer
    permission_classes = [permissions.IsAuthenticated]

class OutfitViewSet(viewsets.ModelViewSet):
    """
    CRUD for outfits. Public read; authenticated create/update/delete.
    """
    # Add the queryset attribute so DRF can determine basename
    queryset = Outfit.objects.all().select_related("owner", "category").prefetch_related("images")
    serializer_class = OutfitSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(title__icontains=search)
        return qs

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class RentalViewSet(viewsets.ModelViewSet):
    """
    CRUD for rentals. Authenticated only.
    """
    queryset = Rental.objects.all().select_related("outfit", "renter")
    serializer_class = RentalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(renter=self.request.user)


# Supabase image upload

import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

@csrf_exempt
def upload_image(request):
    if request.method == "POST":
        image = request.FILES.get("image")
        if not image:
            return JsonResponse({"error": "No file uploaded"}, status=400)
        
        
        # Prepare file for upload to Supabase bucket
        url = f"{settings.SUPABASE_URL}/storage/v1/object/outfits/images/{image.name}"
        headers = {
            "Authorization": f"Bearer {settings.SUPABASE_API_KEY}",
        }

        files = {
            'file': image
        }
        response = requests.post(url, headers=headers, files=files)

        if response.status_code != 200:
            return JsonResponse({"error": "Failed to upload image"}, status=500)

        # After successful upload, get public URL
        image_url = f"{settings.SUPABASE_URL}/storage/v1/object/public/your-bucket-name/images/{image.name}"

        return JsonResponse({"imageUrl": image_url, "message": "Image uploaded successfully"})

    return JsonResponse({"error": "Invalid request method"}, status=400)
