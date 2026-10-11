from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone_number = models.CharField(max_length=25, blank=True, default="")
    current_title = models.CharField(max_length=150, blank=True, default="")
    target_role = models.CharField(max_length=150, blank=True, default="")
    linkedin_url = models.URLField(max_length=300, blank=True, default="")
    github_url = models.URLField(max_length=300, blank=True, default="")
    portfolio_url = models.URLField(max_length=300, blank=True, default="")
    bio = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self):
        return f"Profile for {self.user.username}"


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        if hasattr(instance, "profile"):
            instance.profile.save()
