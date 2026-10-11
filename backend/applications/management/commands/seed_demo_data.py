import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from applications.models import JobApplication
from interviews.models import Interview
from accounts.models import UserProfile


class Command(BaseCommand):
    help = "Seeds realistic demo data for testing JobTrack Pro"

    def add_arguments(self, parser):
        parser.add_argument("--username", type=str, default="demouser", help="Username to attach demo records to")
        parser.add_argument("--password", type=str, default="DemoPass123!", help="Password for user if being created")
        parser.add_argument("--email", type=str, default="demo@jobtrackpro.dev", help="Email for demo user")

    def handle(self, *args, **options):
        username = options["username"]
        password = options["password"]
        email = options["email"]

        user, created = User.objects.get_or_create(username=username, defaults={"email": email, "first_name": "Alex", "last_name": "Morgan"})
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Created demo user '{username}' with email '{email}'."))
        else:
            self.stdout.write(self.style.WARNING(f"Using existing user '{username}'."))

        # Update profile
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.current_title = "Senior Frontend Engineer"
        profile.target_role = "Staff Full-Stack Engineer"
        profile.bio = "Passionate full-stack developer specializing in modern web applications, distributed systems, and clean UX."
        profile.linkedin_url = "https://linkedin.com/in/alexmorgan-demo"
        profile.github_url = "https://github.com/alexmorgan-demo"
        profile.portfolio_url = "https://alexmorgan.dev"
        profile.phone_number = "+1 (555) 382-9102"
        profile.save()

        now = timezone.now()
        today = now.date()

        demo_applications = [
            {
                "job_title": "Senior Full-Stack Engineer",
                "company_name": "Stripe",
                "company_website": "https://stripe.com",
                "job_location": "San Francisco, CA",
                "work_mode": JobApplication.WorkMode.REMOTE,
                "employment_type": JobApplication.EmploymentType.FULL_TIME,
                "job_url": "https://stripe.com/jobs/full-stack-sr",
                "salary_range": "$175,000 - $215,000",
                "application_date": today - datetime.timedelta(days=12),
                "status": JobApplication.Status.INTERVIEW,
                "interview_date": now + datetime.timedelta(days=2, hours=3),
                "recruiter_name": "Sarah Jenkins",
                "recruiter_email": "sjenkins@stripe.com",
                "notes": "Passed technical screener. System design interview scheduled next Tuesday at 2 PM.",
                "interviews": [
                    {
                        "title": "System Design Architecture Round",
                        "interview_type": Interview.InterviewType.SYSTEM_DESIGN,
                        "interview_date": now + datetime.timedelta(days=2, hours=3),
                        "location_or_link": "https://meet.google.com/xyz-demo-strp",
                        "interviewer_names": "David Kim (Staff Architect)",
                        "notes": "Prepare deep-dive into distributed event streams and idempotency keys.",
                    }
                ]
            },
            {
                "job_title": "Lead Frontend Architect",
                "company_name": "Linear",
                "company_website": "https://linear.app",
                "job_location": "Remote / New York",
                "work_mode": JobApplication.WorkMode.REMOTE,
                "employment_type": JobApplication.EmploymentType.FULL_TIME,
                "job_url": "https://linear.app/careers/lead-frontend",
                "salary_range": "$190,000 - $230,000",
                "application_date": today - datetime.timedelta(days=20),
                "status": JobApplication.Status.OFFER,
                "interview_date": now - datetime.timedelta(days=3),
                "recruiter_name": "Marcus Vance",
                "recruiter_email": "mvance@linear.app",
                "notes": "Received written offer: $205,000 base + 0.15% equity grant. Decision deadline next Friday.",
                "interviews": [
                    {
                        "title": "Executive Final Chat with VP",
                        "interview_type": Interview.InterviewType.FINAL,
                        "interview_date": now - datetime.timedelta(days=3),
                        "location_or_link": "https://zoom.us/j/demo-linear",
                        "interviewer_names": "Karri Saarinen",
                        "notes": "Discussed roadmap and design engineering philosophy. Went fantastic.",
                        "is_completed": True,
                        "outcome": Interview.Outcome.PASSED,
                    }
                ]
            },
            {
                "job_title": "Staff Software Engineer - Infrastructure",
                "company_name": "Datadog",
                "company_website": "https://datadoghq.com",
                "job_location": "Boston, MA",
                "work_mode": JobApplication.WorkMode.HYBRID,
                "employment_type": JobApplication.EmploymentType.FULL_TIME,
                "job_url": "https://datadoghq.com/careers/staff-eng",
                "salary_range": "$180,000 - $220,000",
                "application_date": today - datetime.timedelta(days=5),
                "status": JobApplication.Status.ASSESSMENT,
                "interview_date": None,
                "recruiter_name": "Elena Rostova",
                "recruiter_email": "elena.r@datadoghq.com",
                "notes": "Received HackerRank challenge. Deadline in 48 hours. Focus on concurrency and caching.",
                "interviews": []
            },
            {
                "job_title": "Senior Cloud Platform Engineer",
                "company_name": "Vercel",
                "company_website": "https://vercel.com",
                "job_location": "San Francisco, CA",
                "work_mode": JobApplication.WorkMode.REMOTE,
                "employment_type": JobApplication.EmploymentType.FULL_TIME,
                "job_url": "https://vercel.com/careers/cloud-platform",
                "salary_range": "$170,000 - $210,000",
                "application_date": today - datetime.timedelta(days=7),
                "status": JobApplication.Status.INTERVIEW,
                "interview_date": now + datetime.timedelta(days=5, hours=6),
                "recruiter_name": "Chloe Davies",
                "recruiter_email": "chloe@vercel.com",
                "notes": "Hiring manager chat went very well. Pair-programming session coming up.",
                "interviews": [
                    {
                        "title": "Edge Runtime Pair Programming",
                        "interview_type": Interview.InterviewType.TECHNICAL,
                        "interview_date": now + datetime.timedelta(days=5, hours=6),
                        "location_or_link": "https://meet.google.com/vcl-code-demo",
                        "interviewer_names": "Taro Tanaka (Senior Staff)",
                        "notes": "Be ready to debug serverless cold starts and edge caching.",
                    }
                ]
            },
            {
                "job_title": "Full-Stack Product Engineer",
                "company_name": "Notion",
                "company_website": "https://notion.so",
                "job_location": "San Francisco, CA",
                "work_mode": JobApplication.WorkMode.HYBRID,
                "employment_type": JobApplication.EmploymentType.FULL_TIME,
                "job_url": "https://notion.so/careers/product-eng",
                "salary_range": "$160,000 - $200,000",
                "application_date": today - datetime.timedelta(days=3),
                "status": JobApplication.Status.APPLIED,
                "interview_date": None,
                "recruiter_name": "Taylor Reed",
                "recruiter_email": "treed@makenotion.com",
                "notes": "Submitted application via referral from former colleague.",
                "interviews": []
            },
            {
                "job_title": "Senior React / Node Engineer",
                "company_name": "Figma",
                "company_website": "https://figma.com",
                "job_location": "New York, NY",
                "work_mode": JobApplication.WorkMode.REMOTE,
                "employment_type": JobApplication.EmploymentType.FULL_TIME,
                "job_url": "https://figma.com/careers/react-eng",
                "salary_range": "$165,000 - $205,000",
                "application_date": today - datetime.timedelta(days=1),
                "status": JobApplication.Status.APPLIED,
                "interview_date": None,
                "recruiter_name": "Jordan Bell",
                "recruiter_email": "jbell@figma.com",
                "notes": "Applied for Design Systems core team.",
                "interviews": []
            },
            {
                "job_title": "Senior Backend Architect (Python / Go)",
                "company_name": "Airbnb",
                "company_website": "https://airbnb.com",
                "job_location": "Seattle, WA",
                "work_mode": JobApplication.WorkMode.HYBRID,
                "employment_type": JobApplication.EmploymentType.FULL_TIME,
                "job_url": "https://airbnb.com/careers/backend-arch",
                "salary_range": "$185,000 - $225,000",
                "application_date": today - datetime.timedelta(days=35),
                "status": JobApplication.Status.REJECTED,
                "interview_date": None,
                "recruiter_name": "Samantha Wu",
                "recruiter_email": "swu@airbnb.com",
                "notes": "Position was put on freeze and then closed. Recruiter offered to keep profile active for next quarter.",
                "interviews": []
            },
            {
                "job_title": "Principal Design Engineer",
                "company_name": "Supabase",
                "company_website": "https://supabase.com",
                "job_location": "Remote Worldwide",
                "work_mode": JobApplication.WorkMode.REMOTE,
                "employment_type": JobApplication.EmploymentType.CONTRACT,
                "job_url": "https://supabase.com/careers",
                "salary_range": "$100 - $130 / hr",
                "application_date": today,
                "status": JobApplication.Status.WISHLIST,
                "interview_date": None,
                "recruiter_name": "",
                "recruiter_email": "",
                "notes": "Exciting role building open-source developer dashboards. Need to polish OSS portfolio before applying.",
                "interviews": []
            },
            {
                "job_title": "Frontend Engineering Lead",
                "company_name": "Shopify",
                "company_website": "https://shopify.com",
                "job_location": "Toronto / Remote",
                "work_mode": JobApplication.WorkMode.REMOTE,
                "employment_type": JobApplication.EmploymentType.FULL_TIME,
                "job_url": "https://shopify.com/careers/lead-frontend",
                "salary_range": "$170,000 - $210,000 CAD",
                "application_date": today - datetime.timedelta(days=15),
                "status": JobApplication.Status.WISHLIST,
                "interview_date": None,
                "recruiter_name": "",
                "recruiter_email": "",
                "notes": "Bookmarked opening for Merchant Experience tools.",
                "interviews": []
            },
        ]

        # Clear existing demo records for this user to make it idempotent
        JobApplication.objects.filter(user=user).delete()

        created_count = 0
        for item in demo_applications:
            interviews_data = item.pop("interviews", [])
            app_obj = JobApplication.objects.create(user=user, **item)
            created_count += 1

            for interview_info in interviews_data:
                Interview.objects.create(
                    user=user,
                    application=app_obj,
                    **interview_info
                )

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {created_count} demo applications and scheduled interviews for user '{username}'!"))
