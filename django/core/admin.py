from django.contrib import admin
from .models import Profile, Category, Outfit, OutfitImage, Rental

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender')
    search_fields = ('user__username',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class OutfitImageInline(admin.TabularInline):
    model = OutfitImage
    extra = 1

@admin.register(Outfit)
class OutfitAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'category', 'price_per_day', 'created_at')
    list_filter = ('category',)
    search_fields = ('title', 'owner__username')
    inlines = [OutfitImageInline]

@admin.register(Rental)
class RentalAdmin(admin.ModelAdmin):
    list_display = ('outfit', 'renter', 'status', 'start_date', 'end_date', 'created_at')
    list_filter = ('status',)
    search_fields = ('outfit__title', 'renter__username')
