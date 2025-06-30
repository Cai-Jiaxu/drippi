# core/authentication.py
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions
import requests

User = get_user_model()

class ClerkAuthentication(authentication.BaseAuthentication):
    """
    Authenticate via Clerk session cookie (instead of a Bearer JWT header).
    Auto-provision a Django User on first sign-in (username = Clerk user ID).
    """
    def authenticate(self, request):
        # Read the Clerk session cookie instead of Authorization header
        token = request.COOKIES.get('__clerk_session') or request.COOKIES.get('__session')
        if not token:
            return None

        # Verify session with Clerk’s API
        resp = requests.get(
            'https://api.clerk.com/v1/sessions/me',
            headers={'Authorization': f'Bearer {token}'},
            timeout=5,
        )
        if resp.status_code != 200:
            raise exceptions.AuthenticationFailed('Invalid Clerk session token')

        data = resp.json()
        user_id = data.get('user_id')
        if not user_id:
            raise exceptions.AuthenticationFailed('Clerk user_id not found')

        email = (data.get('email_addresses') or [{}])[0].get('email_address', '') or ''
        first_name = data.get('first_name', '') or ''
        last_name = data.get('last_name', '') or ''

        # Get or create local User (username = Clerk ID)
        user, _ = User.objects.get_or_create(
            username=user_id,
            defaults={
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
            }
        )
        return (user, None)
