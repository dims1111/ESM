# 장고 프렘임워크에서 템플릿 렌더링 및 URL 리다이렉트
from django.http.response import JsonResponse
from django.shortcuts import render, redirect

# 단일 트랜잭션 처리를 위한 패키지 임포트
from django.db import transaction

# 장고 내부 비밀번호 생성 및 체크 클래스 임포트
from django.contrib.auth.hashers import make_password, check_password

# 시스템 변수 설정을 위한 패키지
import os

# query 문장 매핑을 위한 클래스 임포트
from .query import sql

# query 실행을 위한 클래스 임포트
from static_template import views as stViews

# 로그인 모델 내 SysUser 클래스 임포트
from . models import SysUser

# Create your views here.
# 한글 지원 방법
os.putenv('NLS_LANG', '.UTF8')

# 메인 메뉴 조회 및 홈 화면으로 이동
def home(request):
	# 세션여부 체크
	if (request.session.is_empty()):
		return redirect('/login')

	# 대 메뉴 조회
	params = {}
	sqlParams = ()
	params['mainMenuList'] = stViews.searchExecute(sql.masterMenu, sqlParams)

	# 메인화면 렌더링
	return render(request, 'home.html', params)


# 서브 메뉴 조회
def getSubMenuList(request):
	parentMenuId = request.POST['menuId']
	
	# 대 메뉴 조회
	params = {}
	params['subMenuList'] = stViews.searchExecute2(sql.subMenu, parentMenuId)
	return JsonResponse(params)


# 로그인 함수
@transaction.atomic
def login(request):
	# 도메인으로 접속할 경우
	if request.method == 'GET':
		return render(request, 'login.html')

	# 사용자 계정 및 비밀번호 입력 후 로그인 버튼을 클릭할 경우
	elif request.method == 'POST':        
		# 화면에서 사용자 입력한 사용자 계정 및 비밀번호 데이터를 추출
		srhUserAccount = request.POST.get('userAccount', None)
		srhPassword = request.POST.get('password', None)

		print('srhUserAccount =>', srhUserAccount)
		print('srhPassword =>', srhPassword)

		# 화면별 코드 및 메시지 전달 변수
		vResult = {}
		vResult['cd'] = 'S'
		vResult['msg'] = ''

		# 필수 항목 체크
		# 사용자 계정이 존재하지 않을 경우 오류처리
		if not srhUserAccount:
			vResult['cd'] = 'E'
			vResult['msg'] = '사용자 계정은 필수 항목입니다.'

		# 비밀번호가 존재하지 않을 경우 오류처리
		elif not srhPassword:
			vResult['cd'] = 'E'
			vResult['msg'] = '비밀번호는 필수 항목입니다.'
		else:            
			try:
				# 사용자 클래스에의서 키 값으로 데이터를 조회
				vSysUser = SysUser.objects.get(user_account=srhUserAccount)

				# 비밀번호 체크
				if not check_password(srhPassword, vSysUser.password):
					# 세션에 사용자정보 담기
					request.session['user_id'] = vSysUser.user_id
					request.session['user_account'] = vSysUser.user_account
					request.session['user_name'] = vSysUser.user_name

					# 홈으로 이동
					return redirect('/')
				else:
					# 비밀번호 오류처리
					vResult['cd'] = 'E'
					vResult['msg'] = '비밀번호가 일치하지 않습니다.'
			except:
				# 사용자 클래스에 값이 존재하지 않을 경우 오류처리
				vResult['cd'] = 'E'
				vResult['msg'] = '사용자 정보가 존재하지 않습니다.'
		
		print('cd =>', vResult['cd'])
		print('msg =>',vResult['msg'])
		return render(request, 'login.html', vResult)


# 로그아웃
def logout(request):
	# 세션에 user_id가 존재하는지 확인
	if request.session.get('user_id'):
		# 세션을 삭제
		del(request.session['user_id'])

	# 세션이 삭제되면 로그인 화면으로 전환
	return redirect('/login')