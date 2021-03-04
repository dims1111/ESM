# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_app
# 프로그램 Name : 로그인, 로그아웃
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# #################################################################################################
# 조회 쿼리
class sql:
    # 대 메뉴 조회
    masterMenu = \
        """
            select smv.menu_cd
                  ,smv.menu_name_ko
                  ,smv.menu_name_en
                  ,smv.icons
                  ,decode(row_number() over (order by smv.sort_order), 1, 'active', null) as active
              from esm.sys_menu_v smv
             where 1=1
               and smv.tree_level = 2
               and smv.use_yn     = 'Y'
             order by smv.sort_order
        """
    
    # 대 메뉴에 따른 하위 메뉴 조회
    subMenu = \
        """
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
            start with sm.parent_menu_cd = &p_parent_menu_cd
            connect by prior sm.menu_cd  = sm.parent_menu_cd
            order siblings by sm.sort_order
        """