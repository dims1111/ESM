# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_app
# 프로그램 Name : 개발 프로그램 Include
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# #################################################################################################
from django.contrib import admin
from django.urls import path
from django.urls.conf import include

# 오류 핸들러
from django.conf.urls import handler404, handler500

handler404 = "esm_app.views.page_not_found_view"
handler500 = "esm_app.views.server_error_view"

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

	path('esm_pop_1000/', include ("esm_pop.esm_pop_1000.urls")),   # 팝업
]
