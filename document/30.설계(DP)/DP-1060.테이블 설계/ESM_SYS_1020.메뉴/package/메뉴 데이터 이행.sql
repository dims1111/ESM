declare
    v_rec esm.sys_menu%ROWTYPE;
begin
    for ca in (
		select t.menu_name_ko
			  ,t.menu_name_en
			  ,t.url
			  ,t.parent_menu_id
			  ,t.icons
			  ,t.sort_order
			  ,t.use_yn
			  ,t.search_yn
			  ,t.insert_yn
			  ,t.update_yn
			  ,t.delete_yn
			  ,t.print_yn
			  ,t.batch_yn
			  ,t.excel_down_yn
			  ,t.excel_up_yn
			  ,t.remark
			  ,t.create_date_time
			  ,t.create_by
			  ,t.update_date_time
			  ,t.update_by
		  from esm.sys_menu_bak t)
    loop
		v_rec.menu_uid         := sys_guid();
		--dbms_output.put_line(v_rec.menu_uid);
		v_rec.menu_name_ko     := ca.menu_name_ko;
		v_rec.menu_name_en     := ca.menu_name_en;
		v_rec.url              := ca.url;
		v_rec.parent_menu_uid  := ca.parent_menu_id;
		v_rec.icons            := ca.icons;
		v_rec.sort_order       := ca.sort_order;
        v_rec.use_yn           := ca.use_yn;
        v_rec.search_yn        := ca.search_yn;
        v_rec.insert_yn        := ca.insert_yn;
        v_rec.update_yn        := ca.update_yn;
        v_rec.delete_yn        := ca.delete_yn;
        v_rec.print_yn         := ca.print_yn;
        v_rec.batch_yn         := ca.batch_yn;
        v_rec.excel_down_yn    := ca.excel_down_yn;
        v_rec.excel_up_yn      := ca.excel_up_yn;
        v_rec.remark           := ca.remark;
        v_rec.create_date_time := ca.create_date_time;
        v_rec.create_by        := ca.create_by;
        v_rec.update_date_time := ca.update_date_time;
        v_rec.update_by        := ca.update_by;

        insert into esm.sys_menu values v_rec;
    end loop;
end;							  
