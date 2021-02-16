"""esm URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path

# 현재 앱의 뷰를 임포트
from . import views

# Create your urls here.
# 현재 앱에서 사용하는 기능을 패턴으로 정의
urlpatterns = [
	path('login/', views.login),
	path('logout/', views.logout),
	path('', views.home),
	path('getSubMenuList', views.getSubMenuList), 
]