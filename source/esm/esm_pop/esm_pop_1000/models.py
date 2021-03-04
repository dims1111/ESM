# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_pop_1000
# 프로그램 Name : 공통 팝업
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# #################################################################################################

from django.db import models


# 코드마스터
class SysCodeMaster(models.Model):
    code_master_uid = models.CharField(primary_key=True, max_length=32)
    master_cd = models.CharField(max_length=30)
    name_ko = models.CharField(max_length=100)
    name_en = models.CharField(max_length=200)
    begin_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    remark = models.CharField(max_length=2000, blank=True, null=True)
    create_date_time = models.DateField(blank=True, null=True)
    create_by = models.CharField(max_length=32, blank=True, null=True)
    update_date_time = models.DateField(blank=True, null=True)
    update_by = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sys_code_master'
        verbose_name = '코드마스터'
        verbose_name_plural = '코드마스터'
        ordering = ['name_ko']


# 코드상세
class SysCodeDetail(models.Model):
    code_detail_uid = models.CharField(primary_key=True, max_length=32)
    master_cd = models.CharField(max_length=30)
    detail_cd = models.CharField(max_length=30)
    name_ko = models.CharField(max_length=100)
    name_en = models.CharField(max_length=200)
    sort_order = models.FloatField()
    begin_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    remark = models.CharField(max_length=2000, blank=True, null=True)
    create_date_time = models.DateField(blank=True, null=True)
    create_by = models.CharField(max_length=32, blank=True, null=True)
    update_date_time = models.DateField(blank=True, null=True)
    update_by = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sys_code_detail'
        verbose_name = '코드상세'
        verbose_name_plural = '코드상세'
        ordering = ['name_ko', 'sort_order']


