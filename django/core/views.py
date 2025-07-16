from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.contrib.auth.models import User
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .supabaseClient import supabase
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework import permissions, status
from rest_framework.response import Response
import uuid
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Rental

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
    
class OutfitImageUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        outfit_id = request.data.get('outfit')
        file = request.FILES.get('image')

        if not outfit_id or not file:
            return Response({"error": "Outfit ID and image file are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        file_ext = file.name.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{file_ext}"

        # Read file bytes
        file_bytes = file.read()

        upload_response = supabase.storage.from_('outfits').upload(unique_filename, file_bytes)

        print("Upload response:", upload_response)
        print("Upload response attributes:", dir(upload_response))

        if not upload_response:
            return Response({"error": "Failed to upload image to Supabase Storage."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Correct usage: get_public_url returns a string URL
        public_url = supabase.storage.from_('outfits').get_public_url(unique_filename)

        print("Public URL:", public_url)

        image = OutfitImage.objects.create(outfit_id=outfit_id, image=public_url)

        serializer = OutfitImageSerializer(image)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class OutfitViewSet(viewsets.ModelViewSet):
    """
    CRUD for outfits. Public read; authenticated create/update/delete.
    """
    # authentication_classes = []
    # Add the queryset attribute so DRF can determine basename
    queryset = Outfit.objects.all()  # your existing queryset
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



class MyListingsView(ListAPIView):
    serializer_class = OutfitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Outfit.objects.filter(owner=self.request.user).prefetch_related("images", "category")


class MyRentalsView(ListAPIView):
    serializer_class = RentalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Rental.objects.filter(renter=self.request.user).select_related("outfit", "outfit__owner")



class CancelRentalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, rental_id):
        try:
            rental = Rental.objects.get(id=rental_id, renter=request.user)
            rental.status = 'cancelled'
            rental.save()
            return Response({'message': 'Rental cancelled'}, status=status.HTTP_200_OK)
        except Rental.DoesNotExist:
            return Response({'error': 'Rental not found'}, status=status.HTTP_404_NOT_FOUND)
        


class ApproveRentalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, rental_id):
        try:
            rental = Rental.objects.get(id=rental_id)

            if rental.outfit.owner != request.user:
                return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

            if rental.status != "requested":
                return Response({"detail": "Only 'requested' rentals can be approved."}, status=status.HTTP_400_BAD_REQUEST)

            rental.status = "approved"
            rental.save()
            return Response({"detail": "Rental approved."}, status=status.HTTP_200_OK)

        except Rental.DoesNotExist:
            return Response({"detail": "Rental not found."}, status=status.HTTP_404_NOT_FOUND)
        
    
class RejectRentalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, rental_id):
        try:
            rental = Rental.objects.get(id=rental_id)

            # Only the outfit owner can reject the rental
            if rental.outfit.owner != request.user:
                return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

            # Only allow rejection if it's still requested
            if rental.status != "requested":
                return Response({"detail": "Only 'requested' rentals can be rejected."}, status=status.HTTP_400_BAD_REQUEST)

            rental.status = "rejected"
            rental.save()
            return Response({"detail": "Rental rejected."}, status=status.HTTP_200_OK)

        except Rental.DoesNotExist:
            return Response({"detail": "Rental not found."}, status=status.HTTP_404_NOT_FOUND)

        
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            # Return empty/default profile if none exists
            profile = Profile(user=request.user)
            profile.save()
        
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            profile = Profile(user=request.user)

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)