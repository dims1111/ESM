# 장고 모델 임포트
from django.db import models



# Register your models here.
# 사용자 클래스
class SysUser(models.Model):
    user_id = models.IntegerField(primary_key=True, verbose_name="사용자ID")
    user_account = models.CharField(max_length=30, verbose_name="사용자계정")
    user_name = models.CharField(max_length=50, verbose_name="사용자명")
    password = models.CharField(max_length=64, verbose_name="비밀번호")
    person_id = models.IntegerField(verbose_name="개인ID")
    hp_number = models.CharField(max_length=30, blank=True, null=True, verbose_name="휴대전화")
    email_addr = models.CharField(max_length=50, blank=True, null=True, verbose_name="이메일")
    remark = models.CharField(max_length=2000, blank=True, null=True, verbose_name="비고")
    create_date_time = models.DateTimeField(blank=True, null=True, auto_now_add=True, verbose_name="생성일시")
    create_by = models.IntegerField(blank=True, null=True, default=-1, verbose_name="생성자ID")
    update_date_time = models.DateTimeField(blank=True, null=True, auto_now_add=True, verbose_name="수정일시")
    update_by = models.IntegerField(blank=True, null=True, default=-1, verbose_name="수정자ID")

    class Meta:
        managed = False # 오라클 테이블 생성하지 않음
        db_table = 'sys_user'
        verbose_name = '사용자'
        verbose_name_plural = '사용자'
        ordering = ['user_name', 'user_account']