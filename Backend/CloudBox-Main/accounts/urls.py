from django.urls import path
from .views import LoginView, Register, LogoutView, RequestOTPView, VarifyOTP,MeView


urlpatterns = [
    path('login/',LoginView.as_view(), name='login'),
    path('register/', Register.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view()),
    path('otp/', RequestOTPView.as_view(), name='OTP_register'),
    path('varify_otp/', VarifyOTP.as_view(), name='VarifyOTP')
]