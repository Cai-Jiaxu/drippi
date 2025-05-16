# core/models.py

from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    user       = models.OneToOneField(User, on_delete=models.CASCADE)
    gender     = models.CharField(
        max_length=1,
        choices=[
            ('M', 'Male'),
            ('F', 'Female'),
            ('O', 'Other'),
        ]
    )

    def __str__(self):
        
        return self.user.username

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Outfit(models.Model):
    owner         = models.ForeignKey(User, on_delete=models.CASCADE, related_name='outfits')
    category      = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)
    title         = models.CharField(max_length=200)
    description   = models.TextField(blank=True)
    size          = models.CharField(max_length=50)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    created_at    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class OutfitImage(models.Model):
    outfit  = models.ForeignKey(Outfit, on_delete=models.CASCADE, related_name='images')
    image   = models.ImageField(upload_to='outfit_images/')

    def __str__(self):
        return f"Image for {self.outfit.title}"

class Rental(models.Model):
    STATUS_CHOICES = [
        ('requested','Requested'),
        ('approved','Approved'),
        ('ongoing','Ongoing'),
        ('completed','Completed'),
        ('cancelled','Cancelled'),
    ]
    outfit     = models.ForeignKey(Outfit, on_delete=models.CASCADE, related_name='rentals')
    renter     = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rentals')
    start_date = models.DateField()
    end_date   = models.DateField()
    status     = models.CharField(max_length=10, choices=STATUS_CHOICES, default='requested')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.renter.username} → {self.outfit.title}"
