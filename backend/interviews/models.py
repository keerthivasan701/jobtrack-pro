from django.db import models
from django.contrib.auth.models import User
from applications.models import JobApplication


class Interview(models.Model):
    class InterviewType(models.TextChoices):
        SCREENING = "Screening", "HR Screening"
        TECHNICAL = "Technical", "Technical Interview"
        SYSTEM_DESIGN = "System Design", "System Design"
        BEHAVIORAL = "Behavioral", "Behavioral / Culture"
        HIRING_MANAGER = "Hiring Manager", "Hiring Manager"
        TAKE_HOME = "Take-Home", "Take-Home Review"
        FINAL = "Final", "Final Round"
        OTHER = "Other", "Other"

    class Outcome(models.TextChoices):
        PENDING = "Pending", "Pending"
        PASSED = "Passed", "Passed"
        DID_NOT_ADVANCE = "Did Not Advance", "Did Not Advance"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="interviews")
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name="interviews")
    title = models.CharField(max_length=255, default="Interview Round")
    interview_type = models.CharField(
        max_length=50,
        choices=InterviewType.choices,
        default=InterviewType.TECHNICAL,
    )
    interview_date = models.DateTimeField()
    location_or_link = models.CharField(max_length=500, blank=True, default="")
    interviewer_names = models.CharField(max_length=255, blank=True, default="")
    notes = models.TextField(blank=True, default="")
    is_completed = models.BooleanField(default=False)
    outcome = models.CharField(
        max_length=50,
        choices=Outcome.choices,
        default=Outcome.PENDING,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["interview_date"]
        indexes = [
            models.Index(fields=["user", "interview_date"]),
            models.Index(fields=["user", "is_completed"]),
        ]

    def __str__(self):
        return f"{self.title} for {self.application.company_name} - {self.interview_date}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Keep application interview_date in sync
        if not self.is_completed and (self.application.interview_date is None or self.interview_date >= self.application.interview_date):
            self.application.interview_date = self.interview_date
            if self.application.status in [JobApplication.Status.WISHLIST, JobApplication.Status.APPLIED]:
                self.application.status = JobApplication.Status.INTERVIEW
            self.application.save(update_fields=["interview_date", "status"])
