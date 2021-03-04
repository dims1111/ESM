# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_pop_1000
# 프로그램 Name : 공통 팝업
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# #################################################################################################

class sql:
    # 공통코드 조회
    codeMasterDetail = \
        """
          select scm.code_master_uid                                               as code_master_uid
                ,scd.code_detail_uid                                               as code_detail_uid
                ,scm.master_cd                                                     as master_cd
                ,case when :p_lang_cd = 'ko' then scm.name_ko else scm.name_en end as master_cd_name
                ,scd.detail_cd                                                     as detail_cd
                ,case when :p_lang_cd = 'ko' then scd.name_ko else scd.name_en end as detail_cd_name
                ,scd.sort_order                                                    as sort_order
                ,to_char(scd.begin_date, 'yyyy-mm-dd')                             as begin_date
                ,to_char(scd.end_date, 'yyyy-mm-dd')                               as end_date
            from esm.sys_code_master scm
                 inner join esm.sys_code_detail scd on scm.master_cd = scm.master_cd
           where 1=1
             and scm.master_cd  = :p_master_cd
             and trunc(sysdate) between scm.begin_date and nvl(scm.end_date, to_date('4712-12-31', 'yyyy-mm-dd'))
           order by scd.sort_order
        """
    
    # 대 메뉴에 따른 하위 메뉴 조회
    subMenu = \
        """
         
        """