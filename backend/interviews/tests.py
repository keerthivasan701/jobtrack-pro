from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
import datetime
from rest_framework import status
from rest_framework.test import APITestCase
from applications.models import JobApplication
from interviews.models import Interview


class InterviewTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="u1", password="Password123!")
        self.user2 = User.objects.create_user(username="u2", password="Password123!")

        self.app1 = JobApplication.objects.create(
            user=self.user1,
            company_name="Netflix",
            job_title="Software Engineer",
            status=JobApplication.Status.APPLIED,
        )

        self.app2 = JobApplication.objects.create(
            user=self.user2,
            company_name="Uber",
            job_title="Backend Engineer",
            status=JobApplication.Status.APPLIED,
        )

        self.list_url = reverse("interview-list")

    def test_create_interview(self):
        self.client.force_authenticate(user=self.user1)
        future_time = timezone.now() + datetime.timedelta(days=2)
        data = {
            "application": self.app1.id,
            "title": "System Design Round",
            "interview_type": "System Design",
            "interview_date": future_time.isoformat(),
            "location_or_link": "https://meet.google.com/abc-xyz",
            "notes": "Discuss scalability and sharding",
        }
        res = self.client.post(self.list_url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Interview.objects.filter(user=self.user1).count(), 1)

    def test_cannot_create_interview_for_other_users_app(self):
        self.client.force_authenticate(user=self.user1)
        future_time = timezone.now() + datetime.timedelta(days=2)
        data = {
            "application": self.app2.id,  # Owned by user2!
            "title": "Malicious attempt",
            "interview_date": future_time.isoformat(),
        }
        res = self.client.post(self.list_url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_toggle_complete(self):
        self.client.force_authenticate(user=self.user1)
        future_time = timezone.now() + datetime.timedelta(days=1)
        interview = Interview.objects.create(
            user=self.user1,
            application=self.app1,
            title="HR Screener",
            interview_date=future_time,
            is_completed=False,
        )
        toggle_url = reverse("interview-toggle-complete", kwargs={"pk": interview.pk})
        res = self.client.post(toggle_url, {"outcome": "Passed"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        interview.refresh_from_db()
        self.assertTrue(interview.is_completed)
        self.assertEqual(interview.outcome, "Passed")
