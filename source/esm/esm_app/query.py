
# 조회 쿼리
class sql:
    # 대 메뉴 조회
    masterMenu = \
        """
            select sm.menu_id
                  ,sm.menu_name_ko
                  ,sm.menu_name_en
                  ,sm.icons
                  ,decode(row_number() over (order by sm.sort_order), 1, 'active', null) as active
              from esm.sys_menu sm
             where 1=1
               and sm.parent_menu_id = 1
               and sm.use_yn         = 'Y'
             order by sm.sort_order
        """
    
    # 대 메뉴에 따른 하위 메뉴 조회
    subMenu = \
        """
            select level as tree_level
                  ,sm.menu_id
                  ,sm.menu_name_ko
                  ,sm.menu_name_en
                  ,sm.url
                  ,sm.parent_menu_id
              from esm.sys_menu sm
             where 1=1
               and sm.use_yn              = 'Y'
             start with sm.parent_menu_id = :p_parent_menu_id
           connect by prior sm.menu_id    = sm.parent_menu_id
             order siblings by sm.sort_order
        """    