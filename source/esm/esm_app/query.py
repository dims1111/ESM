
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
            select smv.tree_level
                  ,smv.menu_cd
                  ,smv.menu_name_ko
                  ,smv.menu_name_en
                  ,smv.url
                  ,smv.parent_menu_cd
              from esm.sys_menu_v smv
             where 1=1
               and smv.use_yn = 'Y'
               and smv.parent_menu_cd = :p_parent_menu_cd
        """    