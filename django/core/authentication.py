# core/authentication.py
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions
import requests

User = get_user_model()

class ClerkAuthentication(authentication.BaseAuthentication):
    """
    Authenticate via Clerk session JWT in `Authorization: Bearer <token>`.
    Auto-provision a Django User on first sign-in (username = Clerk user ID).
    """
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None
        token = auth_header.split(' ', 1)[1]

        # Verify session with Clerk’s API
        resp = requests.get(
            'https://api.clerk.com/v1/sessions/me',
            headers={'Authorization': f'Bearer {token}'},
        )
        if resp.status_code != 200:
            raise exceptions.AuthenticationFailed('Invalid Clerk session token')
        data = resp.json()
        user_id = data.get('user_id')
        email = (data.get('email_addresses') or [{}])[0].get('email_address')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')

        if not user_id:
            raise exceptions.AuthenticationFailed('Clerk user_id not found')

        # Get or create local User (username = Clerk ID)
        user, _ = User.objects.get_or_create(
            username=user_id,
            defaults={
                'email': email or '',
                'first_name': first_name,
                'last_name': last_name,
            }
        )
        return (user, None)
