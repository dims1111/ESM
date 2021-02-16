create or replace view esm.sys_menu_v
as
select lpad(' ', 2 * (level - 1)) || sm.menu_name_ko as menu_name_ko_dis
      ,lpad(' ', 2 * (level - 1)) || sm.menu_name_en as menu_name_en_dis
      ,level                                         as tree_level
      ,sm.menu_id
      ,sm.menu_name_ko
      ,sm.menu_name_en
      ,sm.url
      ,sm.parent_menu_id
      ,sm.icons
      ,sm.sort_order
      ,sm.use_yn
      ,sm.search_yn
      ,sm.insert_yn
      ,sm.update_yn
      ,sm.delete_yn
      ,sm.print_yn
      ,sm.batch_yn
      ,sm.excel_down_yn
      ,sm.excel_up_yn
      ,sm.remark
      ,sm.create_date_time
      ,sm.create_by
      ,sm.update_date_time
      ,sm.update_by
  from esm.sys_menu sm
 where 1=1
 start with sm.parent_menu_id = -1
connect by prior sm.menu_id = sm.parent_menu_id
 order siblings by sm.sort_order
