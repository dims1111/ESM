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


# 서브 메뉴 조회
def searchCodeDetal(dictParams):  
  try:
    # DB연결, 커서생성
    with cx_Oracle.connect(connDns) as connection, connection.cursor() as cursor:
      # 쿼리 실행
      # print('sqlString =>' ,sqlString, type(sqlString))
      cursor.execute(sql.codeMasterDetail, :p_lang_cd=p_lang_cd, :p_master_cd=p_lang_cd)

      # 쿼리 결과값 가져오기
      return JsonResponse(rowsToDictList(cursor))
  
  except (cx_Oracle.DatabaseError, Exception) as e:
    commParam = {'cd' : 'E', 'msg' : e}
    return JsonResponse(commParam)