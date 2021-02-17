
# 조회 / 신규/ 수정 / 삭제 쿼리
class sql:
    # 메뉴 검색
    selectMenu = \
        """
            select sm.menu_id
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
               and nvl(sm.menu_name_ko, '1') = nvl(:p_menu_name_ko, nvl(sm.menu_name_ko, '1'))
               and nvl(sm.url, '1')          = nvl(:p_url, nvl(sm.url, '1'))
               and nvl(sm.use_yn, '1')       = nvl(:p_use_yn, nvl(sm.use_yn, '1'))
             order by sm.sort_order
        """
    
    # 메뉴 신규
    insertMenu = \
        """
            insert into esm.sys_menu
              (
                 menu_id
                ,menu_name_ko
                ,menu_name_en
                ,url
                ,parent_menu_id
                ,icons
                ,sort_order
                ,use_yn
                ,search_yn
                ,insert_yn
                ,update_yn
                ,delete_yn
                ,print_yn
                ,batch_yn
                ,excel_down_yn
                ,excel_up_yn
                ,remark
                ,create_date_time
                ,create_by
                ,update_date_time
                ,update_by
              )
              values(
                 :p_menu_id
                ,:p_menu_name_ko
                ,:p_menu_name_en
                ,:p_url
                ,:p_parent_menu_id
                ,:p_icons
                ,:p_sort_order
                ,nvl(:p_use_yn, 'N')
                ,nvl(:p_search_yn, 'N')
                ,nvl(:p_insert_yn, 'N')
                ,nvl(:p_update_yn, 'N')
                ,nvl(:p_delete_yn, 'N')
                ,nvl(:p_print_yn, 'N')
                ,nvl(:p_batch_yn, 'N')
                ,nvl(:p_excel_down_yn, 'N')
                ,nvl(:p_excel_up_yn, 'N')
                ,:p_remark
                ,trunc(sysdate)
                ,nvl(:p_create_by, -1)
                ,trunc(sysdate)
                ,nvl(:p_update_by, -1)
              )
        """

    # 메뉴 수정
    insertMenu = \
        """
            update esm.sys_menu
               set menu_name_ko      = :p_menu_name_ko
                  ,menu_name_en      = :p_menu_name_en
                  ,url               = :p_url
                  ,parent_menu_id    = :p_parent_menu_id
                  ,icons             = :p_icons
                  ,sort_order        = :p_sort_order
                  ,use_yn            = nvl(:p_use_yn, 'N')
                  ,search_yn         = nvl(:p_search_yn, 'N')
                  ,insert_yn         = nvl(:p_insert_yn, 'N')
                  ,update_yn         = nvl(:p_update_yn, 'N')
                  ,delete_yn         = nvl(:p_delete_yn, 'N')
                  ,print_yn          = nvl(:p_print_yn, 'N')
                  ,batch_yn          = nvl(:p_batch_yn, 'N')
                  ,excel_down_yn     = nvl(:p_excel_down_yn, 'N')
                  ,excel_up_yn       = nvl(:p_excel_up_yn, 'N')
                  ,remark            = :p_remark
                  ,update_date_time  = trunc(sysdate)
                  ,update_by         = nvl(:p_update_by, -1)
             where 1=1
               and use_id = :p_user_id
        """

    # 메뉴 삭제
    deleteMenu = \
        """
            delete
              from esm.sys_menu sm
             where 1=1
               and sm.use_id = :p_user_id
        """