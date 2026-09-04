from django.urls import path
from .views import LoginView, Register, LogoutView, RequestOTPView, VerifyOTPView ,MeView


urlpatterns = [
    path('login/',LoginView.as_view(), name='login'),
    path('register/', Register.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view()),
    path('Request_otp/', RequestOTPView.as_view(), name='OTP_register'),
    path('varify_otp/', VerifyOTPView.as_view(), name='VarifyOTP')
]