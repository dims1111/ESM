select * from esm.django_migrations;
delete from esm.django_migrations where app = 'esm_sys_1020';
commit;
