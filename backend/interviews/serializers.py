from rest_framework import serializers
from .models import Interview
from applications.models import JobApplication


class ApplicationBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ["id", "job_title", "company_name", "status", "job_location", "work_mode"]


class InterviewSerializer(serializers.ModelSerializer):
    application_details = ApplicationBriefSerializer(source="application", read_only=True)

    class Meta:
        model = Interview
        fields = [
            "id",
            "application",
            "application_details",
            "title",
            "interview_type",
            "interview_date",
            "location_or_link",
            "interviewer_names",
            "notes",
            "is_completed",
            "outcome",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "application_details", "created_at", "updated_at"]

    def validate_application(self, value):
        request = self.context.get("request")
        if request and request.user:
            if value.user != request.user:
                raise serializers.ValidationError("You cannot schedule an interview for another user's application.")
        return value
