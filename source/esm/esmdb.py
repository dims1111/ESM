# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128, blank=True, null=True)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150, blank=True, null=True)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.CharField(max_length=254, blank=True, null=True)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200, blank=True, null=True)
    action_flag = models.IntegerField()
    change_message = models.TextField(blank=True, null=True)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100, blank=True, null=True)
    model = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField(blank=True, null=True)
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class PersonMaster(models.Model):
    person_id = models.FloatField(primary_key=True)
    person_name_ko = models.CharField(max_length=100)
    person_name_en = models.CharField(max_length=200)
    resident_number = models.CharField(max_length=13)
    birth_date = models.DateField()
    gender_code = models.CharField(max_length=30)
    internal_email_addr = models.CharField(max_length=50, blank=True, null=True)
    external_email_addr = models.CharField(max_length=50, blank=True, null=True)
    hp_phone_number = models.CharField(max_length=30, blank=True, null=True)
    home_phone_number = models.CharField(max_length=30, blank=True, null=True)
    company_phone_number = models.CharField(max_length=30, blank=True, null=True)
    create_date_time = models.DateField(blank=True, null=True)
    create_by = models.FloatField(blank=True, null=True)
    update_date_time = models.DateField(blank=True, null=True)
    update_by = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'person_master'


class SysAuth(models.Model):
    auth_id = models.FloatField(primary_key=True)
    auth_name_ko = models.CharField(max_length=100)
    auth_name_en = models.CharField(max_length=200)
    begin_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    remark = models.CharField(max_length=2000, blank=True, null=True)
    create_date_time = models.DateField(blank=True, null=True)
    create_by = models.FloatField(blank=True, null=True)
    update_date_time = models.DateField(blank=True, null=True)
    update_by = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sys_auth'


class SysAuthMenu(models.Model):
    auth_menu_id = models.FloatField(primary_key=True)
    auth_id = models.FloatField()
    menu_id = models.FloatField()
    user_yn = models.CharField(max_length=1)
    user_insert_yn = models.CharField(max_length=1)
    user_update_yn = models.CharField(max_length=1)
    user_delete_yn = models.CharField(max_length=1)
    user_print_yn = models.CharField(max_length=1)
    user_batch_yn = models.CharField(max_length=1)
    user_excel_down_yn = models.CharField(max_length=1)
    user_excel_up_yn = models.CharField(max_length=1)
    remark = models.CharField(max_length=2000, blank=True, null=True)
    create_date_time = models.DateField(blank=True, null=True)
    create_by = models.FloatField(blank=True, null=True)
    update_date_time = models.DateField(blank=True, null=True)
    update_by = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sys_auth_menu'


class SysLangCode(models.Model):
    lang_id = models.FloatField(primary_key=True)
    lang_type_cd = models.CharField(max_length=100)
    lang_name_ko = models.CharField(max_length=2000)
    lang_name_en = models.CharField(max_length=2000)
    remark = models.CharField(max_length=2000, blank=True, null=True)
    create_date_time = models.DateField(blank=True, null=True)
    create_by = models.FloatField(blank=True, null=True)
    update_date_time = models.DateField(blank=True, null=True)
    update_by = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sys_lang_code'


class SysMenu(models.Model):
    menu_uid = models.CharField(primary_key=True, max_length=32)
    menu_cd = models.CharField(max_length=20)
    menu_name_ko = models.CharField(max_length=100)
    menu_name_en = models.CharField(max_length=200)
    url = models.CharField(max_length=200, blank=True, null=True)
    parent_menu_cd = models.CharField(max_length=20)
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


class SysUser(models.Model):
    user_id = models.FloatField(primary_key=True)
    user_account = models.CharField(max_length=30)
    user_name = models.CharField(max_length=50)
    password = models.CharField(max_length=128)
    person_id = models.FloatField()
    hp_number = models.CharField(max_length=30, blank=True, null=True)
    email_addr = models.CharField(max_length=50, blank=True, null=True)
    remark = models.CharField(max_length=2000, blank=True, null=True)
    create_date_time = models.DateField(blank=True, null=True)
    create_by = models.FloatField(blank=True, null=True)
    update_date_time = models.DateField(blank=True, null=True)
    update_by = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sys_user'


class SysUserAuth(models.Model):
    user_auth_id = models.FloatField(primary_key=True)
    user_id = models.FloatField()
    auth_id = models.FloatField()
    begin_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    remark = models.CharField(max_length=2000, blank=True, null=True)
    create_date_time = models.DateField(blank=True, null=True)
    create_by = models.FloatField(blank=True, null=True)
    update_date_time = models.DateField(blank=True, null=True)
    update_by = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sys_user_auth'
