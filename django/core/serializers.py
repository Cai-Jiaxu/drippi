# serializers convert between python objects and JSON (models -> JSON, JSON -> models)
# lists out the fields which API sends or receives

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Category, Outfit, OutfitImage, Rental

class RegisterSerializer(serializers.Serializer):
    """
    Handles user sign-up: creates a User and associated Profile.
    """
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    gender   = serializers.ChoiceField(choices=Profile._meta.get_field('gender').choices)

    #checks that username isn't taken 
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        Profile.objects.create(user=user, gender=validated_data['gender'])
        return user


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serialize the extra fields on the user profile.
    """
    class Meta:
        model = Profile
        fields = ['gender']


class UserSerializer(serializers.ModelSerializer):
    """
    Basic user info: first/last name, email, and profile.
    """
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile']


class CategorySerializer(serializers.ModelSerializer):
    """
    For listing outfit categories.
    """
    class Meta:
        model = Category
        fields = ['id', 'name']


class OutfitImageSerializer(serializers.ModelSerializer):
    """
    Returns the URL for each outfit image.
    """
    class Meta:
        model = OutfitImage
        fields = ['id', 'image']


class OutfitSerializer(serializers.ModelSerializer):
    """
    Serializes an outfit, including its owner, category, and images.
    """
    owner    = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images   = OutfitImageSerializer(many=True, read_only=True)

    class Meta:
        model  = Outfit
        fields = [
            'id',
            'title',
            'description',
            'size',
            'price_per_day',
            'created_at',
            'owner',
            'category',
            'images',
        ]


class RentalSerializer(serializers.ModelSerializer):
    """
    Serializes a rental request, nested with outfit and renter details.
    """
    outfit = OutfitSerializer(read_only=True)
    renter = UserSerializer(read_only=True)

    class Meta:
        model  = Rental
        fields = [
            'id',
            'outfit',
            'renter',
            'start_date',
            'end_date',
            'status',
            'created_at',
        ]
