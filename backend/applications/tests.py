from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from applications.models import JobApplication


class JobApplicationTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="user1", email="user1@example.com", password="Password123!")
        self.user2 = User.objects.create_user(username="user2", email="user2@example.com", password="Password123!")

        # Create applications for user1
        self.app1 = JobApplication.objects.create(
            user=self.user1,
            company_name="Google",
            job_title="Software Engineer",
            status=JobApplication.Status.APPLIED,
            work_mode=JobApplication.WorkMode.REMOTE,
        )
        self.app2 = JobApplication.objects.create(
            user=self.user1,
            company_name="Meta",
            job_title="Frontend Engineer",
            status=JobApplication.Status.INTERVIEW,
            work_mode=JobApplication.WorkMode.HYBRID,
        )

        # Create application for user2
        self.app_user2 = JobApplication.objects.create(
            user=self.user2,
            company_name="Apple",
            job_title="iOS Engineer",
            status=JobApplication.Status.OFFER,
        )

        self.list_url = reverse("application-list")
        self.stats_url = reverse("application-stats")

    def test_list_applications_user_isolation(self):
        # User 1 should only see user 1's applications
        self.client.force_authenticate(user=self.user1)
        res = self.client.get(self.list_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # Results inside paginated list
        results = res.data["results"]
        self.assertEqual(len(results), 2)
        company_names = [item["company_name"] for item in results]
        self.assertIn("Google", company_names)
        self.assertIn("Meta", company_names)
        self.assertNotIn("Apple", company_names)

    def test_create_application(self):
        self.client.force_authenticate(user=self.user1)
        data = {
            "company_name": "Amazon",
            "job_title": "Cloud Architect",
            "status": "Applied",
            "work_mode": "Remote",
            "salary_range": "$160k - $190k",
            "notes": "Referral through classmate",
        }
        res = self.client.post(self.list_url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobApplication.objects.filter(user=self.user1, company_name="Amazon").count(), 1)

    def test_update_application_status(self):
        self.client.force_authenticate(user=self.user1)
        status_url = reverse("application-update-status", kwargs={"pk": self.app1.pk})
        res = self.client.patch(status_url, {"status": "Interview"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.app1.refresh_from_db()
        self.assertEqual(self.app1.status, JobApplication.Status.INTERVIEW)

    def test_cannot_access_or_delete_other_user_application(self):
        # User 1 attempts to delete User 2's application
        self.client.force_authenticate(user=self.user1)
        detail_url = reverse("application-detail", kwargs={"pk": self.app_user2.pk})
        res = self.client.delete(detail_url)
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(JobApplication.objects.filter(pk=self.app_user2.pk).exists())

    def test_dashboard_stats(self):
        self.client.force_authenticate(user=self.user1)
        res = self.client.get(self.stats_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["total_applications"], 2)
        self.assertIn("status_distribution", res.data)
        self.assertIn("monthly_trend", res.data)
