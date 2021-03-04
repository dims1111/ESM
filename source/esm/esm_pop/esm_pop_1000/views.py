# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_pop_1000
# 프로그램 Name : 공통 팝업
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# #################################################################################################
from django.shortcuts import render

# 오라클 접속하기 위한 패키지 임포트
import cx_Oracle

# 공통 쿼리 클랙스 임포트
from . query import sql

# query 실행을 위한 클래스 임포트
from esm_com import views as esmComViews


# 공통코드 조회
def searchCodeDetal(dictParams):  
  try:
    dictParams = {}
    dictParams["&p_lang_cd"] = 'ko'

    # 공통코드 조회
    params = {}
    params['resultData'] = esmComViews.searchExecute(sql.codeMasterDetail, dictParams)
    return JsonResponse(params)
    
  except (Exception) as e:
    return JsonResponse( {'cd' : 'E', 'msg' : str(e)} )