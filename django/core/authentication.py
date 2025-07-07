# core/authentication.py
import os, requests, jwt
from jwt import PyJWKClient
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions

User = get_user_model()
JWKS_URL = "https://sharing-ray-73.clerk.accounts.dev/.well-known/jwks.json"
ISSUER = "https://sharing-ray-73.clerk.accounts.dev"

class ClerkAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return None
        token = auth.split(" ", 1)[1]

        # 1) Retrieve the signing key from Clerk’s JWKS
        try:
            jwks_client = PyJWKClient(JWKS_URL)
            signing_key = jwks_client.get_signing_key_from_jwt(token).key
        except Exception as e:
            raise exceptions.AuthenticationFailed(f"JWT error (fetch key): {e}")

        # 2) Decode & validate the JWT
        try:
            payload = jwt.decode(
                token,
                signing_key,
                algorithms=["RS256"],
                issuer=ISSUER,
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token has expired")
        except jwt.PyJWTError as e:
            raise exceptions.AuthenticationFailed(f"JWT decode error: {e}")

        # 3) Extract the user identifier (subject)
        user_id = payload.get("sub")
        if not user_id:
            raise exceptions.AuthenticationFailed("No \"sub\" claim in token")

        # 4) Get or create your Django user
        user, _ = User.objects.get_or_create(
            username=user_id,
            defaults={
                "email": payload.get("email", ""),
                "first_name": payload.get("first_name", ""),
                "last_name": payload.get("last_name", ""),
            },
        )
        return (user, None)
