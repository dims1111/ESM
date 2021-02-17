from django.db import models

# Create your models here.
# 메뉴 클래스
class SysMenu(models.Model):
    menu_id = models.FloatField(primary_key=True)
    menu_name_ko = models.CharField(max_length=100)
    menu_name_en = models.CharField(max_length=200)
    url = models.CharField(max_length=200, blank=True, null=True)
    prent_menu_id = models.FloatField()
    icons = models.CharField(max_length=1000, blank=True, null=True)
    sort_order = models.FloatField(blank=True, null=True)
    use_yn = models.CharField(max_length=1)
    search_yn = models.CharField(max_length=1)
    insert_yn = models.CharField(max_length=1)
    update_yn = models.CharField(max_length=1)
    delete_yn = models.CharField(max_length=1)
    print_yn = models.CharField(max_length=1)
    batch_yn = models.CharField(max_length=1)
    excel_down_yn = models.CharField(max_length=1)
    excel_up_yn = models.CharField(max_length=1)
    remark = models.CharField(max_length=2000, blank=True, null=True)
    create_date_time = models.DateField(blank=True, null=True)
    create_by = models.FloatField(blank=True, null=True)
    update_date_time = models.DateField(blank=True, null=True)
    update_by = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sys_menu'