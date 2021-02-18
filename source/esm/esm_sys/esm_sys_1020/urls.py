from django.urls import path

# 현재 앱의 뷰를 임포트
from . import views


# Create your urls here.
# 현재 앱에서 사용하는 기능을 패턴으로 정의
urlpatterns = [
  path('', views.home),
  path('search', views.search),
  path('print', views.doPrint),
	path('save', views.save),
	path('excelDown', views.excelDown),
  path('excelUp', views.excelUp), 
]
