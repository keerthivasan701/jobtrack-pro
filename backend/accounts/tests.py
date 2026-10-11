from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class AuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse("auth-register")
        self.login_url = reverse("auth-login")
        self.profile_url = reverse("auth-profile")

        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "StrongPassword123!",
            "password_confirm": "StrongPassword123!",
            "first_name": "Test",
            "last_name": "User",
        }

    def test_registration_success(self):
        response = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("tokens", response.data)
        self.assertIn("access", response.data["tokens"])
        self.assertTrue(User.objects.filter(username="testuser").exists())

    def test_registration_password_mismatch(self):
        mismatched_data = dict(self.user_data)
        mismatched_data["password_confirm"] = "DifferentPassword123!"
        response = self.client.post(self.register_url, mismatched_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_and_profile_access(self):
        # Register user
        self.client.post(self.register_url, self.user_data, format="json")

        # Login
        login_res = self.client.post(
            self.login_url,
            {"username": "testuser", "password": "StrongPassword123!"},
            format="json",
        )
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        token = login_res.data["access"]

        # Access profile with token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        profile_res = self.client.get(self.profile_url)
        self.assertEqual(profile_res.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_res.data["username"], "testuser")

    def test_unauthenticated_profile_rejected(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
