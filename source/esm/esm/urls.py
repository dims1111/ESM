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
from django.contrib import admin
from django.urls import path
from django.urls.conf import include

# 오류 핸들러
from django.conf.urls import handler404, handler500


handler404 = "esm_app.views.page_not_found_view"
handler500 = "esm_app.views.server_error_view"

# Create your urls here.
# 프로젝트에서 사용할 앱의 경로 및 기능을 패턴으로 정의
urlpatterns = [
	path('admin/', admin.site.urls),                                # 장고 Admin
	path('', include("esm_app.urls")),                              # 로그인, 로그아웃, 홈    
	path('home/', include('esm_app.urls')),
	path('menu/', include('esm_app.urls')),
    path('err/', include('esm_app.urls')),
	path('esm_sys_1000/', include ("esm_sys.esm_sys_1000.urls")),   # 사용자등록
	path('esm_sys_1010/', include ("esm_sys.esm_sys_1010.urls")),   # 메뉴등록
	path('esm_sys_1020/', include ("esm_sys.esm_sys_1020.urls")),   # 언어코드등록
    
	path('esm_dev_1000/', include ("esm_dev.esm_dev_1000.urls")),   # 테스트1
]
