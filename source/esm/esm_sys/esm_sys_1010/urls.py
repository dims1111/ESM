from django.urls import path

# 현재 앱의 뷰를 임포트
from . import views

urlpatterns = [
    path('', views.home),
]