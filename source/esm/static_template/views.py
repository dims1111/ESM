# Create your views here.
from django.http import request
from django.shortcuts import render

# 오라클 접속하기 위한 패키지
import cx_Oracle

# esm 프로젝트 settings 오라클 접속 DNS 임포트
from esm.settings import connectionDns as connDns


# 조회 쿼리 수행
def searchExecute(request, sqlString, sqlParam):	
    mainMenuList = {}
    try:
		# DB연결, 커서생성
        with cx_Oracle.connect(connDns) as connection, connection.cursor() as cursor:
            # 쿼리 실행
            print('sqlString =>' ,sqlString, type(sqlString))
            print('sqlParam =>' ,sqlParam, type(sqlParam))
            cursor.execute(sqlString, sqlParam)

            # 쿼리 결과값 가져오기 
            mainMenuList = rows_to_dict_list(cursor)
            return mainMenuList
    except (cx_Oracle.DatabaseError, Exception) as e:
        print('오류내용 =>', e)

# 조회 쿼리 수행 
# 위 함수와 병합하여 처리가 필요한데 매개변수가 1..n개 형식도 다른데 병합 처리 ???
def searchExecute2(request, sqlString, parentMenuId):	
    mainMenuList = {}
    try:
		# DB연결, 커서생성
        with cx_Oracle.connect(connDns) as connection, connection.cursor() as cursor:
            # 쿼리 실행
            print('sqlString =>' ,sqlString, type(sqlString))
            print('parentMenuId =>' ,parentMenuId, type(parentMenuId))
            cursor.execute(sqlString, p_parent_menu_id=parentMenuId)

            # 쿼리 결과값 가져오기 
            mainMenuList = rows_to_dict_list(cursor)
            return mainMenuList
    except (cx_Oracle.DatabaseError, Exception) as e:
        print('오류내용 =>', e)

# 커서를 List Dictionary 형태로 변환
def rows_to_dict_list(cursor):
	columns = [camelCase(i[0]) for i in cursor.description]
	return [dict(zip(columns, row)) for row in cursor]


# 문자 카멜케이스로 변경
def camelCase(st):
    output = ''.join(x for x in st.title() if x.isalnum())
    return output[0].lower() + output[1:]


# 예외 처리
def esmExceptionNum(errNum):    
    if errNum == 1000:
        return '사용자 계정 또는 이메일 주소가 존재하지 않습니다.'
    elif errNum == 1010:
        return '비밀번호가 일치하지 않습니다.'