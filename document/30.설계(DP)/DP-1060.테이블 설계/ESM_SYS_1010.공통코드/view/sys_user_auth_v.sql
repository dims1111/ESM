create or replace view esm.sys_user_auth_v 
as
select su.user_id
      ,su.user_account
      ,su.user_name
      ,su.password
      ,su.person_id
      ,pm.person_name_ko
      ,pm.person_name_en
      ,su.hp_number
      ,su.email_addr
      ,sua.user_auth_id
      ,sua.auth_id
	  ,sa.auth_name_ko
	  ,sa.auth_name_en
      ,sua.begin_date
      ,sua.end_date
      ,sua.remark
      ,sua.create_date_time
      ,sua.create_by
      ,sua.update_date_time
      ,sua.update_by
  from esm.sys_user su
       inner join esm.sys_user_auth sua on su.user_id   = sua.user_id
       left  join esm.person_master pm  on su.person_id = pm.person_id
	   left  join esm.sys_auth      sa  on sua.auth_id  = sa.auth_id
 where 1=1
   and trunc(sysdate) between sua.begin_date and nvl(sua.end_date, trunc(sysdate))
   and trunc(sysdate) between sa.begin_date  and nvl(sa.end_date, trunc(sysdate))
       
