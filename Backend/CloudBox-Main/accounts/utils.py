from django.conf import settings
from django.core.mail import send_mail


def send_otp_email(email, otp_code):
    subject = "CloudBox Login OTP"

    message = f"""
Hello,

Your CloudBox login OTP is:

{otp_code}

This OTP will expire in 5 minutes.

If you did not request this OTP, please ignore this email.

Regards,
CloudBox Team
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )