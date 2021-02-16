from django.db import models

# 로그인 앱의 모델내 SysUser 클래스 임포트
from . models import SysUser



# Create your models here.
# 장고 Admin 데이터 조호시 그리드에 출력될 항목 정의
class SysUserAdmin(admin.ModelAdmin):    
    list_display = ('user_id', 'user_account', 'user_name', 'hp_number', 'email_addr', 'person_id')

# 장고 Admin 등록
admin.site.register(SysUser, SysUserAdmin)