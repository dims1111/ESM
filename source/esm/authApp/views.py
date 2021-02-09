from django.shortcuts import render,redirect
import cx_Oracle
#한글 지원 방법

import os
os.putenv('NLS_LANG', '.UTF8')

# Create your views here.

def login(request):

  if request.method == 'POST':

    # 입력값 가져오기
    userid = request.POST['userid']
    in_password = request.POST['password']


    # DB연결
    connection = cx_Oracle.connect('esm/esm@210.112.232.29:1531/vis1226')

    # 커서생성
    cursor = connection.cursor()

    # 쿼리문입력(입력받은 아이디와 같은 아이디의 패스워드 값 가져오기)
    cursor.execute("""
    select password 
    from sys_user 
    where user_account =: user_account""",
    user_account = userid
    )


    
    password_o = ""

    # 결과값 가져오기
    for password in cursor:

      # 변수에 결과값 넣어주기
      password_o = password[0]



    print(password_o, "=", in_password)

    # 쿼리문을 통해 가져온 데이터베이스와 
    if password_o == in_password:

      print('로그인성공')

      cursor.close()
      connection.close()
      return render(request, 'test.html')

    else:


      cursor.close()
      connection.close()
      print('로그인실패')
      return render(request, 'login.html')

  # POST방식이 아닐 시
  else:

    return render(request, 'login.html')

  