import random

from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIViews
from rest_framework.response import Response
from django.core.cache import cache
# Create your views here.

class Register(APIViews):

    def post(request):



        return Response('register')



class Login(APIViews):
    def get(request):

        return Response('hello')


class Logout(APIViews):

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
        otp_store_key = f"otp:{email}"

        cache.set(otp_store_key, otp_code, timeout=300)

        return Response({
            "message": "OTP sent successfully.",
            "expires_in_seconds": 300
        }, status=status.HTTP_200_OK)