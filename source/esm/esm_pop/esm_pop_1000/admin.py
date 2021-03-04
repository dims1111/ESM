# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_pop_1000
# 프로그램 Name : 공통 팝업
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# #################################################################################################

from django.contrib import admin


# 모델내 클래스 임포트
from . models import SysCodeMaster, SysCodeDetail


# 장고 Admin 데이터 조호시 그리드에 출력될 항목 정의
# 코드마스터
class SysCodeMasterAdmin(admin.ModelAdmin):    
    list_display = (
        'code_master_uid',
        'master_cd',
        'name_ko',
        'name_en',
        'begin_date',
        'end_date',
        'remark',
        'create_date_time',
        'create_by',
        'update_date_time',
        'update_by',
    )

# 코드상세
class SysCodeDetailAdmin(admin.ModelAdmin):    
    list_display = (
        'code_detail_uid',
        'master_cd',
        'detail_cd',
        'name_ko',
        'name_en',
        'sort_order',
        'begin_date',
        'end_date',
        'remark',
        'create_date_time',
        'create_by',
        'update_date_time',
        'update_by',
    )

# 장고 Admin 등록
admin.site.register(SysCodeMaster, SysCodeMasterAdmin)
admin.site.register(SysCodeDetail, SysCodeDetailAdmin)
