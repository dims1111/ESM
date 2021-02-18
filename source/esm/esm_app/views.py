# 장고 프렘임워크에서 템플릿 렌더링 및 URL 리다이렉트
from django.http.response import JsonResponse
from django.shortcuts import render, redirect

# 단일 트랜잭션 처리를 위한 패키지 임포트
from django.db import transaction

# 장고 모델에서 필터 처리를 위한 Q 클래스 임포트
from django.db.models import Q

# 장고 내부 비밀번호 생성 및 체크 클래스 임포트
from django.contrib.auth.hashers import make_password, check_password

# 장고 로그아웃 처리를 위한 클래스 임포트
from django.contrib.auth import logout as auth_logout

# 시스템 변수 설정을 위한 패키지
import os

# query 문장 매핑을 위한 클래스 임포트
from .query import sql

# query 실행을 위한 클래스 임포트
from esm_com import views as stViews

# 로그인 모델 내 SysUser 클래스 임포트
from . models import SysUser

# esm_com 예외처리 및 메시지 함수 임포트
from esm_com.lang import langMag


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
  params['mainMenuList'] = stViews.searchExecute(request, sql.masterMenu, sqlParams)
  params['session'] = request.session

  # 메인화면 렌더링
  return render(request, 'esm_app/home.html', params)


# 서브 메뉴 조회
def getSubMenuList(request):
  parentMenuId = request.POST['menuId']

  # 대 메뉴 조회
  params = {}
  params['subMenuList'] = stViews.searchExecute2(request, sql.subMenu, parentMenuId)
  return JsonResponse(params)


# 로그인 함수
@transaction.atomic
def login(request):
  # 도메인으로 접속할 경우
  if request.method == 'GET':
    return render(request, 'esm_app/login.html')

  # 사용자 계정 및 비밀번호 입력 후 로그인 버튼을 클릭할 경우
  elif request.method == 'POST':
    # 화면에서 사용자 입력한 사용자 계정 및 비밀번호 데이터를 추출
    srhUserAccount = request.POST.get('userAccount', None)
    srhPassword = request.POST.get('password', None)

    # 화면별 코드 및 메시지 전달 변수
    commParam = {'cd' : 'S', 'msg' : ''}

    # 필수 항목 체크
    # 사용자 계정이 존재하지 않을 경우 오류처리
    if not srhUserAccount:
      commParam = {'cd' : 'E', 'msg' : '사용자 계정은 필수 항목입니다.'}

    # 비밀번호가 존재하지 않을 경우 오류처리
    elif not srhPassword:
      commParam = {'cd' : 'E', 'msg' : '비밀번호는 필수 항목입니다.'}

    else:
      try:
        # 데이터 조회 : 사용자계정 또는 이메일 주소
        queryset = SysUser.objects.filter(Q(user_account=srhUserAccount) | Q(email_addr=srhUserAccount)).values()

        # [오류] 사용자 계정 또는 이메일 주소 미 존재
        if not queryset.exists():          
          print("사용자 미존재", langMag.msgParam)
          langMag.msgParam['errNum'] = 1000          
          raise langMag.no_data_found(langMag.errMsg())
        else:

          print("사용자 존재", queryset, type(queryset))
          for ca in queryset:            
            # 세션에 사용자정보 추가 
            request.session['user_id'] = ca.get('user_id')
            request.session['user_name'] = ca.get('user_name')
            request.session['user_account'] = ca.get('user_ccount')          

            # 사용자 비밀번호 저장을 makepassword 클래스 사용시 수정 필요
            #if check_password(srhPassword, vPassword):          
            if srhPassword == ca.get('password'):
              # 홈으로 이동
              return redirect('/')
            else:
              print("비밀번호 불일치")
              langMag.msgParam['errNum'] = 1010
              raise langMag.no_data_match(langMag.errMsg())

      except (langMag.no_data_found, langMag.no_data_match) as e:
        commParam = {'cd' : 'E', 'msg' : e}
      except Exception as e:
        commParam = {'cd' : 'E', 'msg' : '[Error Info.] '.join(e.args)}

    return render(request, 'esm_app/login.html', commParam)


# 로그아웃
def logout(request):
  # 세션에 user_id가 존재하는지 확인
  if not (request.session.is_empty()):
    # 브라우저 세션 삭제
    request.session.clear()

    # 장고 세션 삭제
    auth_logout(request)

  # 세션이 삭제되면 로그인 화면으로 전환
  return redirect('/login')



# 404 오류 발생
def page_not_found_view(request, exception=None):
  data = {}
  return render(request, "esm_app/err404.html", status=404)


# 500 오류 발생
def server_error_view(request):
  data = {}
  return render(request, "esm_app/err500.html", status=500)