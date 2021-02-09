create or replace view esm.sys_user_v 
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
      ,su.remark
      ,su.create_date_time
      ,su.create_by
      ,su.update_date_time
      ,su.update_by
  from esm.sys_user su
       left join esm.person_master pm on su.person_id = pm.person_id
 where 1=1
	   
