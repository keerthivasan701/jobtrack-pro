from rest_framework import serializers
from .models import JobApplication


class JobApplicationSerializer(serializers.ModelSerializer):
    interviews_count = serializers.IntegerField(source="interviews.count", read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            "id",
            "job_title",
            "company_name",
            "company_website",
            "job_description",
            "job_location",
            "work_mode",
            "employment_type",
            "job_url",
            "salary_range",
            "application_date",
            "status",
            "interview_date",
            "recruiter_name",
            "recruiter_email",
            "notes",
            "interviews_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "interviews_count", "created_at", "updated_at"]

    def validate_job_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Job title cannot be empty.")
        return value.strip()

    def validate_company_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Company name cannot be empty.")
        return value.strip()


class JobApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ["status"]
