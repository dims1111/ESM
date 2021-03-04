# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_com
# 프로그램 Name : 시스템 공통 - 동적SQL
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# #################################################################################################
# 오라클 접속하기 위한 패키지
import cx_Oracle

# esm 프로젝트 settings 오라클 접속 DNS 임포트
from esm.settings import connectionDns as connDns

# rowsToDictList 클래스 임포트
from esm_com.util import rowsToDictList


# 조회 쿼리 수행
def searchExecute(request, sqlString, dictParams):
    resultSet = {}
    try:
        # DB연결, 커서생성
        with cx_Oracle.connect(connDns) as connection, connection.cursor() as cursor:
            # 쿼리 실행
            # print('sqlString =>' ,sqlString, type(sqlString))
            cursor.execute(sqlString, dictParams)

            # 쿼리 결과값 가져오기 
            return rowsToDictList(cursor)
    except (cx_Oracle.DatabaseError, Exception) as e:
        raise e