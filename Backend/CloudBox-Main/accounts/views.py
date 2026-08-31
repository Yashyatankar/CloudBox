import random

from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer


# Create your views here.
MAX_VARIFICATION = 5


class Register(APIView):

    def post(request):

        userSer = UserSerializer
        
        if not userSer.is_valid():

            return Response({"error:The details are not valid"}, status=status.HTTP_400_BAD_REQUEST)

        user = userSer.save()

        refresh = RefreshToken.for_user(user)

        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        request.session['access_token'] = access_token
        request.session['refresh_token'] = refresh_token
        request.session['user_id'] = user.id


        return Response({
            "message": "User registered successfully.",
            "email": user.email,
        }, status=status.HTTP_201_CREATED)



class Login(APIView):

    def get(request):

        

        return Response('hello')


class Logout(APIView):

    def get(request):

        return Response('logout')


class RequestOTPView(APIView):

    def post(self, request):

        email = request.data.get('email', '').strip().lower()

        if not email:

            return Response({"error": "email is required"},  status=status.HTTP_400_BAD_REQUEST)

        rate_limit = f"opt:rate_limit:{email}"

        count_limit = cache.get(rate_limit, 0)

        if count_limit >= 3:
            return Response({"error: Too many requests"}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        if cache.add(rate_limit, 1, ):

            cache.set(count_limit, 1, timeout=60)

        else:

            cache.incr(count_limit)

        otp_code = str(random.randint(100000, 999999))
        otp_store_key = f"otp:login:{email}"

        cache.set(otp_store_key, {"code":otp_code, "attempt":0}, timeout=300)

        return Response({
            "message": "OTP sent successfully.",
            "expires_in_seconds": 300
        }, status=status.HTTP_200_OK)


class VarifyOTP(APIView):

    def post(self, request):

        email = request.data.get('email', '').strip().lower() 
        otp_store_key = f"otp:login:{email}"

        input_otp = request.data.get('otp', '').strip()

        if not input_otp and not email:
            return Response({"error:The varification may be wrong or expired please try again"}, status=status.HTTP_400_BAD_REQUEST)

        record = cache.get(otp_store_key)

        if not record:
            return Response({"error:OTP expired or not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if record["attempt"] > MAX_VARIFICATION:
            cache.delete(otp_store_key)
            return Response({"error:Too many requests please try again letter"}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        if input_otp != record:
            record["attempts"] += 1
            cache.set(otp_store_key, record, timeout=120)
            return Response({"error:Not  valid OTP please try again"}, status=status.HTTP_400_BAD_REQUEST)
        
        cache.delete(otp_store_key)
        
        return Response(
            {
                "Successfully:Successfully created account"
            },
            status=status.HTTP_200_OK
        ) 