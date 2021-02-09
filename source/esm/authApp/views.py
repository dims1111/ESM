# 장고 프렘임워크에서 템플릿 렌더링 및 URL 리다이렉트
from django.shortcuts import render, redirect

# 단일 트랜잭션 처리를 위한 패키지 임포트
from django.db import transaction

# 오라클 접속하기 위한 패키지
import cx_Oracle

# 시스템 변수 설정을 위한 패키지
import os

# 한글 지원 방법
os.putenv('NLS_LANG', '.UTF8')

# login 함수
@transaction.atomic
def login(request):
	if request.method == 'POST':
    
	# 입력값 가져오기
    srchUserAccount = request.POST['userid']
    srchPassword = request.POST['password']

	# DB연결
	connection = cx_Oracle.connect('esm/esm@210.112.232.29:1531/vis1226')

	# 커서생성
	cursor = connection.cursor()
	
	# 테이블에 존재하는 비밀번호
	vPassword = ""

    try:
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
        	return render(request, 'test.html')
      	else:
			print('로그인에 실패')
        	return render(request, 'login.html')

    # POST방식이 아닐 시
    else:
      	return render(request, 'login.html')
  	except Exception as e:
    	print(e)
  	else:
    	print("정상적으로 로그인 하였습니다.")
  	finally:
		cursor.close()
		connection.close()	  	
