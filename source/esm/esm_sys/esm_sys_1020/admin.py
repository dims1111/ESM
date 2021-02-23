from django.contrib import admin


# Register your models here.
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
    ,'delete_row_yn'
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