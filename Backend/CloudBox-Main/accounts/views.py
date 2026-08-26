from django.shortcuts import render
from rest_framework.views import APIViews
from rest_framework.response import Response
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
    