# core/authentication.py
import os
import requests
import jwt
from jwt import PyJWKClient
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions

User = get_user_model()
JWKS_URL = "https://sharing-ray-73.clerk.accounts.dev/.well-known/jwks.json"
ISSUER = "https://sharing-ray-73.clerk.accounts.dev"

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

def fetch_clerk_user(user_id, api_key):
    url = f"https://api.clerk.dev/v1/users/{user_id}"
    headers = {"Authorization": f"Bearer {api_key}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    return None

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

        # 4) Fetch full user info from Clerk API
        if not CLERK_SECRET_KEY:
            raise exceptions.AuthenticationFailed("Missing Clerk API key in environment")

        clerk_user = fetch_clerk_user(user_id, CLERK_SECRET_KEY)
        if clerk_user is None:
            raise exceptions.AuthenticationFailed("Failed to fetch user info from Clerk API")

        first_name = clerk_user.get("first_name", "") or ""
        last_name = clerk_user.get("last_name", "") or ""
        # Sometimes emails are nested inside email_addresses list
        emails = clerk_user.get("email_addresses", [])
        email = emails[0].get("email_address") if emails else ""

        # 5) Get or create your Django user and update fields
        user, created = User.objects.get_or_create(username=user_id)
        updated = False

        if user.email != email and email:
            user.email = email
            updated = True
        if user.first_name != first_name and first_name:
            user.first_name = first_name
            updated = True
        if user.last_name != last_name and last_name:
            user.last_name = last_name
            updated = True

        if updated:
            user.save()

        return (user, None)
