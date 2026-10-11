from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Interview
from .serializers import InterviewSerializer


class InterviewViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InterviewSerializer
    filterset_fields = ["is_completed", "interview_type", "outcome", "application"]
    search_fields = ["title", "interviewer_names", "notes", "location_or_link", "application__company_name", "application__job_title"]
    ordering_fields = ["interview_date", "created_at"]
    ordering = ["interview_date"]

    queryset = Interview.objects.none()

    def get_queryset(self):
        # Strict user isolation
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return Interview.objects.none()
        return Interview.objects.filter(user=self.request.user).select_related("application")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post", "patch"], url_path="toggle-complete")
    def toggle_complete(self, request, pk=None):
        interview = self.get_object()
        interview.is_completed = not interview.is_completed
        if "outcome" in request.data:
            interview.outcome = request.data["outcome"]
        interview.save()
        return Response(self.get_serializer(interview).data)

    @action(detail=False, methods=["get"], url_path="upcoming")
    def upcoming(self, request):
        now = timezone.now()
        interviews = self.get_queryset().filter(
            interview_date__gte=now,
            is_completed=False,
        ).order_by("interview_date")
        serializer = self.get_serializer(interviews, many=True)
        return Response(serializer.data)
