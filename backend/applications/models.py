from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class JobApplication(models.Model):
    class WorkMode(models.TextChoices):
        REMOTE = "Remote", "Remote"
        HYBRID = "Hybrid", "Hybrid"
        ON_SITE = "On-site", "On-site"

    class EmploymentType(models.TextChoices):
        FULL_TIME = "Full-time", "Full-time"
        PART_TIME = "Part-time", "Part-time"
        INTERNSHIP = "Internship", "Internship"
        CONTRACT = "Contract", "Contract"

    class Status(models.TextChoices):
        WISHLIST = "Wishlist", "Wishlist"
        APPLIED = "Applied", "Applied"
        ASSESSMENT = "Assessment", "Assessment"
        INTERVIEW = "Interview", "Interview"
        OFFER = "Offer", "Offer"
        REJECTED = "Rejected", "Rejected"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="applications")
    job_title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    company_website = models.URLField(max_length=500, blank=True, null=True)
    job_description = models.TextField(blank=True, default="")
    job_location = models.CharField(max_length=255, blank=True, default="")
    work_mode = models.CharField(
        max_length=50,
        choices=WorkMode.choices,
        default=WorkMode.REMOTE,
    )
    employment_type = models.CharField(
        max_length=50,
        choices=EmploymentType.choices,
        default=EmploymentType.FULL_TIME,
    )
    job_url = models.URLField(max_length=500, blank=True, null=True)
    salary_range = models.CharField(max_length=150, blank=True, default="")
    application_date = models.DateField(default=timezone.localdate)
    status = models.CharField(
        max_length=50,
        choices=Status.choices,
        default=Status.APPLIED,
    )
    interview_date = models.DateTimeField(blank=True, null=True)
    recruiter_name = models.CharField(max_length=255, blank=True, default="")
    recruiter_email = models.EmailField(blank=True, default="")
    notes = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-application_date", "-created_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["user", "application_date"]),
            models.Index(fields=["user", "company_name"]),
        ]

    def __str__(self):
        return f"{self.job_title} at {self.company_name} ({self.user.username})"
