# UUID 클래스 임포트
import uuid

# 장고 모델 클래스 임포트
from django.db import models
from django.db.models.constraints import UniqueConstraint
from django.db.models.indexes import Index

# #################################################################################################
# 장고 테이블 생성 후 재 생성 방법 
# 아래 명령어를 실행하여도 테이블이 생성 또는 변경되지 않을 경우
# python manage.py makemigrations
# python manage.py migrate

# 장고에서 관리하는 마이그레이션 테이블의 앱 정보를 삭제 후 재생성
# select * from esm.django_migrations;
# delete from esm.django_migrations where app = 'esm_sys_1020';
# commit;

# 마이그레이션 앱 정보 삭제 후 재 생성
# python manage.py makemigrations
# python manage.py migrate
# #################################################################################################

# #################################################################################################
# 테이블 및 뷰는 모두 오라클에서 생성
# 파이썬에서 테이블 reverse
# python manage.py inspectdb > esmdb.py
# 각 뷰에 맞는 클래스 복사

# 화면에서 사용할 뷰 클래스 작성
# 조회 버튼(search class)에서 뷰 클래스 사용 
# #################################################################################################


# Create your models here.
# 메뉴 클래스 (UUID 사용 : To-Be 모델로 사용)
class SysMenu(models.Model):
    menu_uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name="메뉴UID")
    menu_cd = models.CharField(max_length=20, verbose_name="메뉴코드")
    menu_name_ko = models.CharField(max_length=100, verbose_name="메뉴명(한글)")
    menu_name_en = models.CharField(max_length=200, verbose_name="메뉴명(영문)")
    url = models.CharField(max_length=200, blank=True, null=True, verbose_name="URL")
    parent_menu_cd = models.CharField(max_length=20, verbose_name="상위메뉴코드")
    icons = models.CharField(max_length=1000, blank=True, null=True, verbose_name="아이콘")
    sort_order = models.IntegerField(blank=True, null=True, verbose_name="정렬순서")
    use_yn = models.CharField(max_length=1, verbose_name="사용여부(Y/N)", default="Y")
    search_yn = models.CharField(max_length=1, verbose_name="조회여부(Y/N)", default="Y")
    insert_yn = models.CharField(max_length=1, verbose_name="신규여부(Y/N)", default="Y")
    update_yn = models.CharField(max_length=1, verbose_name="수정여부(Y/N)", default="Y")
    delete_yn = models.CharField(max_length=1, verbose_name="삭제여부(Y/N)", default="Y")
    print_yn = models.CharField(max_length=1, verbose_name="출력여부(Y/N)", default="N")
    batch_yn = models.CharField(max_length=1, verbose_name="생성여부(Y/N)", default="N")
    excel_down_yn = models.CharField(max_length=1, verbose_name="엑셀다운로드여부(Y/N)", default="Y")
    excel_up_yn = models.CharField(max_length=1, verbose_name="엑셀업로드여부(Y/N)", default="N")
    remark = models.CharField(max_length=2000, blank=True, null=True, verbose_name="비고")
    create_date_time = models.DateTimeField(blank=True, null=True, auto_now_add=True, verbose_name="생성일시")
    create_by = models.IntegerField(blank=True, null=True, default=-1, verbose_name="생성자ID")
    update_date_time = models.DateTimeField(blank=True, null=True, auto_now_add=True, verbose_name="수정일시")
    update_by = models.IntegerField(blank=True, null=True, default=-1, verbose_name="수정자ID")

    class Meta:        
        db_table = 'sys_menu'    
        verbose_name = '메뉴'
        verbose_name_plural = '메뉴'
        constraints = [
            UniqueConstraint(fields=['menu_cd', 'parent_menu_cd'], name='sys_menu_uk')
        ]
        indexes = [
            Index(fields=['menu_name_ko', 'menu_name_en', 'url', 'use_yn'], name='sys_menu_ix1'),
        ]

 
# 메뉴 클래스 (View 사용)
# 뷰 생성시 필수로 ID 필드를 생성 필요
class SysMenuV(models.Model):
    menu_uid = models.CharField(max_length=32)
    menu_cd = models.CharField(max_length=20)
    path_ko = models.CharField(max_length=1000)
    path_en = models.CharField(max_length=1000)
    menu_name_ko_dis = models.CharField(max_length=100)
    menu_name_en_dis = models.CharField(max_length=200)
    menu_name_ko = models.CharField(max_length=100)
    menu_name_en = models.CharField(max_length=200)
    url = models.CharField(max_length=200)
    parent_menu_cd = models.CharField(max_length=32)
    icons = models.CharField(max_length=1000)
    sort_order = models.IntegerField()
    use_yn = models.CharField(max_length=1)
    search_yn = models.CharField(max_length=1)
    insert_yn = models.CharField(max_length=1)
    update_yn = models.CharField(max_length=1)
    delete_yn = models.CharField(max_length=1)
    print_yn = models.CharField(max_length=1)
    batch_yn = models.CharField(max_length=1)
    excel_down_yn = models.CharField(max_length=1)
    excel_up_yn = models.CharField(max_length=1)
    remark = models.CharField(max_length=2000)    
    create_date_time = models.DateTimeField()
    create_by = models.IntegerField()
    update_date_time = models.DateTimeField()
    update_by = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'sys_menu_v'
        ordering = ['-use_yn', 'sort_order']