# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_sys_1020
# 프로그램 Name : 메뉴등록
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# #################################################################################################
from django.contrib import admin


# 로그인 앱의 모델내 SysMenu 클래스 임포트
from . models import SysMenu

# Create your models here.
# 장고 Admin 데이터 조호시 그리드에 출력될 항목 정의
class SysMenuAdmin(admin.ModelAdmin):    
  list_display = (
     'menu_uid'
    ,'menu_cd' 
    ,'menu_name_ko'
    ,'menu_name_en'
    ,'url'
    ,'parent_menu_cd'
    ,'icons'
    ,'sort_order'
    ,'use_yn'
    ,'search_yn'
    ,'add_row_yn'
    ,'del_row_yn'
    ,'save_yn'
    ,'copy_yn'
    ,'batch_yn'
    ,'print_yn'
    ,'excel_down_yn'
    ,'excel_up_yn'
    ,'remark'
    ,'create_date_time'
    ,'create_by'
    ,'update_date_time'
    ,'update_by'
  )

# 장고 Admin 등록
admin.site.register(SysMenu, SysMenuAdmin)