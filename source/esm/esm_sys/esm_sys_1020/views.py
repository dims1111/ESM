from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import redirect, render


# 장고 모델에서 필터 처리를 위한 Q 클래스 임포트
from django.db.models import Q

# esm_com 예외처리 함수 임포트
from esm_com import message

# 로그인 모델 내 SysMenu 클래스 임포트
from . models import SysMenu


# Create your views here.
# 메뉴 클릭 후 첫 화면 오픈
def home(request):  
  return render(request, 'esm_sys/esm_sys_1020.html')

# 조회 버튼을 클릭
def search(request):
  # 화면에서 검색조건의 값
  srhMenuName = request.POST.get('menuName', None)
  srhUrl = request.POST.get('url', None)
  srhUseYn = request.POST.get('useYn', None)

  # print('메뉴명     =>', srhMenuName)
  # print('URL       =>', srhUrl)
  # print('사용여부   =>', srhUseYn)

  # 화면별 코드 및 메시지 전달 변수
  vResult = {}
  vResult['cd'] = 'S'
  vResult['msg'] = ''
		          
  try:    
    queryset = SysMenu.objects.filter(Q(menu_name_ko=srhMenuName) | Q(menu_name_en=srhMenuName) | Q(url=srhUrl) | Q(use_yn=srhUseYn))
    # 메뉴 데이터 조회
    if not queryset.exists():
      raise Exception(message.esmErrMsg(1020), message.UserLangCd.langCd)
    else:
      print('query ->', queryset.query)

      # 메뉴 데이터 확인
      for ca in queryset:
        print('menu_id =>', ca.menu_id)
        print('menu_name_ko =>', ca.menu_name_ko)

  except Exception as e:
    vResult['cd'] = 'E'
    vResult['msg'] = e
		
  print('cd =>', vResult['cd'])
  print('msg =>',vResult['msg'])

  # 그리드에 데이터를 전달
  # 1. 데이터가 존재하지 않을 경우
  # 2. 데이터가 1건 이상일 경우 그리드에 표기
  return JsonResponse({'test': 1, 'test2': 2})
  

# 출력 버튼을 클릭
def doPrint(request):
  return render(request, 'esm_sys/esm_sys_1020.html')

# 저장 버튼을 클릭
def save(request):
  return render(request, 'esm_sys/esm_sys_1020.html')

# 엑셀업로드 버튼을 클릭
def excelDown(request):
  return render(request, 'esm_sys/esm_sys_1020.html')  

# 엑셀다운로드 버튼을 클릭
def excelUp(request):
  return render(request, 'esm_sys/esm_sys_1020.html')
