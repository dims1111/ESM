from django.db import models


# Create your models here.
# 메뉴 클래스
class SysMenu(models.Model):
    menu_id = models.IntegerField(primary_key=True, verbose_name="메뉴ID")
    menu_name_ko = models.CharField(max_length=100, verbose_name="메뉴명(한글)")
    menu_name_en = models.CharField(max_length=200, verbose_name="메뉴명(영문)")
    url = models.CharField(max_length=200, blank=True, null=True, verbose_name="URL")
    prent_menu_id = models.FloatField(verbose_name="상위메뉴ID")
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
        managed = False
        db_table = 'sys_menu'
        verbose_name = '메뉴'
        verbose_name_plural = '메뉴'
        ordering = ['-use_yn', 'sort_order']