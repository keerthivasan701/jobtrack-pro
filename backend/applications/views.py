from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncMonth
from datetime import timedelta
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import JobApplication
from .serializers import JobApplicationSerializer, JobApplicationStatusUpdateSerializer


class StandardResultsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class JobApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = JobApplicationSerializer
    pagination_class = StandardResultsPagination
    filterset_fields = ["status", "work_mode", "employment_type"]
    search_fields = ["company_name", "job_title", "job_location", "notes", "recruiter_name"]
    ordering_fields = ["application_date", "company_name", "created_at", "status"]
    ordering = ["-application_date", "-created_at"]

    queryset = JobApplication.objects.none()

    def get_queryset(self):
        # Strict user isolation - never leak other users' data
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return JobApplication.objects.none()
        return JobApplication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["patch"], url_path="status")
    def update_status(self, request, pk=None):
        application = self.get_object()
        serializer = JobApplicationStatusUpdateSerializer(application, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(JobApplicationSerializer(application).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="all-items")
    def all_items(self, request):
        """Returns all applications unpaginated for Kanban board with optional search/filters."""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        user = request.user
        apps = JobApplication.objects.filter(user=user)
        total = apps.count()

        # Status counts
        status_counts = {
            "wishlist": apps.filter(status=JobApplication.Status.WISHLIST).count(),
            "applied": apps.filter(status=JobApplication.Status.APPLIED).count(),
            "assessment": apps.filter(status=JobApplication.Status.ASSESSMENT).count(),
            "interview": apps.filter(status=JobApplication.Status.INTERVIEW).count(),
            "offer": apps.filter(status=JobApplication.Status.OFFER).count(),
            "rejected": apps.filter(status=JobApplication.Status.REJECTED).count(),
        }

        # Upcoming interviews count (from application interview_date or linked interviews)
        now = timezone.now()
        upcoming_interviews_count = apps.filter(
            interview_date__gte=now
        ).count()

        # Status distribution chart data
        status_palette = {
            "Wishlist": "#64748b",     # Slate
            "Applied": "#3b82f6",      # Blue
            "Assessment": "#8b5cf6",   # Purple
            "Interview": "#f59e0b",    # Amber
            "Offer": "#10b981",        # Emerald
            "Rejected": "#ef4444",     # Red
        }

        status_distribution = []
        for choice_val, choice_label in JobApplication.Status.choices:
            count = apps.filter(status=choice_val).count()
            status_distribution.append({
                "status": choice_label,
                "count": count,
                "percentage": round((count / total * 100), 1) if total > 0 else 0,
                "color": status_palette.get(choice_val, "#6366f1"),
            })

        # Applications by month chart (last 6 months)
        six_months_ago = (now - timedelta(days=180)).date().replace(day=1)
        monthly_query = (
            apps.filter(application_date__gte=six_months_ago)
            .annotate(month=TruncMonth("application_date"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )

        monthly_dict = {}
        for entry in monthly_query:
            if entry["month"]:
                m_label = entry["month"].strftime("%b %Y")
                monthly_dict[m_label] = entry["count"]

        # Build chronological list for last 6 months
        monthly_trend = []
        curr_date = six_months_ago
        while curr_date <= now.date():
            label = curr_date.strftime("%b %Y")
            monthly_trend.append({
                "month": curr_date.strftime("%b"),
                "period": label,
                "count": monthly_dict.get(label, 0),
            })
            # Advance by approx 1 month
            next_month = curr_date.month + 1 if curr_date.month < 12 else 1
            next_year = curr_date.year if curr_date.month < 12 else curr_date.year + 1
            curr_date = curr_date.replace(year=next_year, month=next_month, day=1)

        # Recent applications (last 5)
        recent_apps = apps.order_by("-created_at")[:5]
        recent_serialized = JobApplicationSerializer(recent_apps, many=True).data

        # Upcoming interviews list
        from interviews.models import Interview
        from interviews.serializers import InterviewSerializer

        upcoming_interviews = Interview.objects.filter(
            user=user,
            interview_date__gte=now,
            is_completed=False,
        ).order_by("interview_date")[:5]
        upcoming_serialized = InterviewSerializer(upcoming_interviews, many=True).data

        return Response({
            "total_applications": total,
            "status_counts": status_counts,
            "interviews_scheduled": upcoming_interviews_count,
            "status_distribution": status_distribution,
            "monthly_trend": monthly_trend,
            "recent_applications": recent_serialized,
            "upcoming_interviews": upcoming_serialized,
        })
