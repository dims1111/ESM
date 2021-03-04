create or replace view esm.sys_menu_v as
select lpad(' ', 2 * (level - 1)) || sm.menu_name_ko          as menu_name_ko_dis
	  ,lpad(' ', 2 * (level - 1)) || sm.menu_name_en          as menu_name_en_dis
	  ,substr(sys_connect_by_path(sm.menu_name_ko, ' > '), 4) as path_ko
	  ,substr(sys_connect_by_path(sm.menu_name_en, ' > '), 4) as path_en
	  ,level                                                  as tree_level
	  ,sm.menu_uid as id
	  ,sm.menu_uid
	  ,sm.menu_cd
	  ,sm.menu_name_ko
	  ,sm.menu_name_en
	  ,sm.url
	  ,sm.parent_menu_cd
	  ,sm.icons
	  ,sm.sort_order
	  ,sm.use_yn
	  ,sm.search_yn
	  ,sm.add_row_yn
	  ,sm.del_row_yn
	  ,sm.save_yn
	  ,sm.copy_yn
	  ,sm.batch_yn
	  ,sm.print_yn
	  ,sm.excel_down_yn
	  ,sm.excel_up_yn
	  ,sm.remark
	  ,sm.create_date_time
	  ,sm.create_by
	  ,sm.update_date_time
	  ,sm.update_by
  from esm.sys_menu sm
 where 1=1
 start with sm.parent_menu_cd = 'ROOT'
connect by prior sm.menu_cd = sm.parent_menu_cd
 order siblings by sm.sort_order;
