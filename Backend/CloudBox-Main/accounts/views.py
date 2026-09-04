import random
import secrets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, LoginSerializer
from .utils import send_otp_email
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your views here.
MAX_VARIFICATION = 5


# accounts/views.py
class MeView(APIView):
    def get(self, request):
        user_id = request.session.get('user_id')
        if not user_id:
            return Response({"authenticated": False}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"authenticated": True, "user_id": user_id})

class Register(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            userSer = UserSerializer(data=request.data)
            
            if not userSer.is_valid():

                return Response(userSer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                user = userSer.save()

                refresh = RefreshToken.for_user(user)

                access_token = str(refresh.access_token)
                refresh_token = str(refresh)

                request.session['access_token'] = access_token
                request.session['refresh_token'] = refresh_token
                request.session['user_id'] = user.id

        except Exception as e:

            print("REGISTER ERROR:", e)

            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            "message": "User registered successfully.",
            "email": user.email,
       }, status=status.HTTP_201_CREATED)



LOGIN_RATE_LIMIT_WINDOW = 900
LOGIN_RATE_LIMIT_MAX = 5
LOGIN_LOCKOUT_WINDOW = 900
LOGIN_LOCKOUT_MAX = 5


class LoginView(APIView):

    def post(self, request):
        
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email'].strip().lower()
        password = serializer.validated_data['password']
        ip = self._get_client_ip(request)

        # 1. IP-based rate limit
        ip_key = f"login:ratelimit:ip:{ip}"
        if cache.add(ip_key, 1, timeout=LOGIN_RATE_LIMIT_WINDOW):
            ip_count = 1
        else:
            ip_count = cache.incr(ip_key)

        if ip_count > LOGIN_RATE_LIMIT_MAX:
            return Response({"error": "Too many login attempts. Try again later."},
                             status=status.HTTP_429_TOO_MANY_REQUESTS)

        # 2. Account-based lockout
        lockout_key = f"login:lockout:{email}"
        failed_attempts = cache.get(lockout_key, 0)

        if failed_attempts >= LOGIN_LOCKOUT_MAX:
            return Response({"error": "Account temporarily locked. Try again later."},
                             status=status.HTTP_429_TOO_MANY_REQUESTS)

        # 3. Check the person exists in the DB, and password matches
        user = User.objects.filter(email__iexact=email).first()

        if user is None or not user.check_password(password):
            if cache.add(lockout_key, 1, timeout=LOGIN_LOCKOUT_WINDOW):
                pass
            else:
                cache.incr(lockout_key)
            return Response({"error": "Invalid email or password"},
                             status=status.HTTP_400_BAD_REQUEST)

        if not user.is_active:
            return Response({"error": "Invalid email or password"},
                             status=status.HTTP_400_BAD_REQUEST)

        # 4. Success — clear lockout, issue JWT, store it in Redis-backed session
        cache.delete(lockout_key)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        request.session['access_token'] = access_token
        request.session['refresh_token'] = refresh_token
        request.session['user_id'] = user.id

        return Response({
            "message": "Login successful.",
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }, status=status.HTTP_200_OK)

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')
    

class LogoutView(APIView):
    permission_classes = (IsAuthenticated)



# views.py
class LogoutView(APIView):
    def post(self, request):
        request.session.flush()
        return Response({"message": "Logged out"}, status=status.HTTP_200_OK)


RATE_LIMIT_MAX = 3
RATE_LIMIT_WINDOW = 900
OTP_TTL = 300
MAX_VERIFICATION = 5


class RequestOTPView(APIView):

    def post(self, request):
        email = request.data.get('email', '').strip().lower()

        if not email:
            return Response({"error": "email is required"}, status=status.HTTP_400_BAD_REQUEST)

        rate_key = f"otp:ratelimit:{email}"

        if cache.add(rate_key, 1, timeout=RATE_LIMIT_WINDOW):
            count = 1
        else:
            count = cache.incr(rate_key)

        if count > RATE_LIMIT_MAX:
            return Response({"error": "Too many requests. Try again later."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        otp_code = f"{secrets.randbelow(1000000):06d}"
        otp_store_key = f"otp:login:{email}"
        cache.set(otp_store_key, {"code": otp_code, "attempts": 0}, timeout=OTP_TTL)

        send_otp_email(email, otp_code)

        return Response({
            "message": "OTP sent successfully.",
            "expires_in_seconds": OTP_TTL
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        input_otp = request.data.get('otp', '').strip()

        if not email or not input_otp:
            return Response({"error": "email and otp are required"}, status=status.HTTP_400_BAD_REQUEST)

        otp_store_key = f"otp:login:{email}"
        record = cache.get(otp_store_key)

        if not record:
            return Response({"error": "OTP expired or not found"}, status=status.HTTP_400_BAD_REQUEST)

        if record["attempts"] >= MAX_VERIFICATION:
            cache.delete(otp_store_key)
            return Response({"error": "Too many incorrect attempts. Request a new OTP."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        if input_otp != record["code"]:
            record["attempts"] += 1
            cache.set(otp_store_key, record, timeout=OTP_TTL)
            return Response({"error": "Incorrect OTP. Please try again."}, status=status.HTTP_400_BAD_REQUEST)

        cache.delete(otp_store_key)

        user = User.objects.filter(email__iexact=email).first()
        if user is None or not user.is_active:
            return Response({"error": "Account not available"}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        request.session['access_token'] = str(refresh.access_token)
        request.session['refresh_token'] = str(refresh)
        request.session['user_id'] = user.id

        return Response({"message": "Login successful.", "email": user.email}, status=status.HTTP_200_OK)