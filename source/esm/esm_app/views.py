# 장고 프렘임워크에서 템플릿 렌더링 및 URL 리다이렉트
from django.http.response import JsonResponse
from django.shortcuts import render, redirect

import json

# 단일 트랜잭션 처리를 위한 패키지 임포트
from django.db import transaction

# 오라클 접속하기 위한 패키지
import cx_Oracle

# 시스템 변수 설정을 위한 패키지
import os

# 한글 지원 방법
os.putenv('NLS_LANG', '.UTF8')

# 메인화면
def main(request):
	# 세션여부 체크
	if (request.session.is_empty()):
		return redirect('/login')

	params = {}

	connectionDns = 'esm/esm@210.112.232.29:1531/vis1226'
	try:
		# DB연결, 커서생성
		with cx_Oracle.connect(connectionDns) as connection, connection.cursor() as cursor:
			# 쿼리문입력(입력받은 아이디와 같은 아이디의 패스워드 값 가져오기)
			cursor.execute(
			"""
				SELECT t.MENU_ID
						, t.MENU_NAME_KO
						, t.MENU_NAME_EN
						, t.ICONS
						, DECODE(ROW_NUMBER() OVER (ORDER BY t.sort_order), 1, 'active', NULL) AS ACTIVE -- 임시컬럼
					FROM SYS_MENU t
				WHERE t.PRENT_MENU_ID = 1
					AND t.USE_YN = 'Y'
				ORDER BY t.SORT_ORDER
			""")          	

			# 결과값 가져오기 
			mainMenuList = rows_to_dict_list(cursor)
			params['mainMenuList'] = mainMenuList
	except Exception as e:
		print(e)

	# 메인화면 렌더링
	return render(request, 'main.html', params)

# login 함수
@transaction.atomic
def login(request):

	# GET 방식
	if request.method == 'GET':
		return render(request, 'login.html')
	# POST 방식
	else:
		# 입력값 가져오기
		srchUserAccount = request.POST['userAccount']
		srchPassword = request.POST['password']

		# 테이블에 존재하는 비밀번호
		vPassword = ""

		connectionDns = 'esm/esm@210.112.232.29:1531/vis1226'

		try:
			# DB연결, 커서생성
			with cx_Oracle.connect(connectionDns) as connection, connection.cursor() as cursor:
				# 쿼리문입력(입력받은 아이디와 같은 아이디의 패스워드 값 가져오기)
				cursor.execute( \
				"""
					select su.password 
					  from esm.sys_user su
				     where 1=1
					   and su.user_account = :user_account
				""", user_account = srchUserAccount
				)          	

				# 결과값 가져오기
				for password in cursor:
					# 변수에 결과값 넣어주기
					vPassword = password[0]

				print(vPassword, "=", srchPassword)

				# 쿼리문을 통해 가져온 데이터베이스와 
				if vPassword == srchPassword:
					print('로그인에 성공')
					request.session['loginSuccess'] = True # Temp 세션값
					return redirect('/')
				else:
					print('로그인에 실패')
					return render(request, 'login.html')

		except Exception as e:
			print(e)
		else:
			print("정상적으로 로그인 하였습니다. 이제 메인 화면을 작성하시기 바랍니다.")

def getSubMenuList(request):
	menuId = request.POST['menuId']
	results = {}

	connectionDns = 'esm/esm@210.112.232.29:1531/vis1226'
	try:
		# DB연결, 커서생성
		with cx_Oracle.connect(connectionDns) as connection, connection.cursor() as cursor:
			# 쿼리문입력(입력받은 아이디와 같은 아이디의 패스워드 값 가져오기)
			cursor.execute(
			"""
				SELECT LEVEL AS TREE_LEVEL
							,SM.MENU_ID
							,SM.MENU_NAME_KO
							,SM.MENU_NAME_EN
							,SM.URL
							,SM.PRENT_MENU_ID
					FROM ESM.SYS_MENU SM
				WHERE 1 = 1
					AND SM.USE_YN = 'Y'
				START WITH SM.PRENT_MENU_ID = :menuId
				CONNECT BY PRIOR SM.MENU_ID = SM.PRENT_MENU_ID
				ORDER SIBLINGS BY SM.SORT_ORDER
			""", menuId = menuId)       	

			# 결과값 가져오기 
			subMenuList = rows_to_dict_list(cursor)
			results['subMenuList'] = subMenuList
	except Exception as e:
		print(e)
	
	return JsonResponse(results)


# 커서를 List Dictionary 형태로 변환
def rows_to_dict_list(cursor):
	columns = [camelCase(i[0]) for i in cursor.description]
	return [dict(zip(columns, row)) for row in cursor]

# 문자 카멜케이스로 변경
def camelCase(st):
    output = ''.join(x for x in st.title() if x.isalnum())
    return output[0].lower() + output[1:]