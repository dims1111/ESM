from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.core import serializers


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
  print('=================================================')
  srhMenuName = request.POST.get('menuName', None)
  srhUrl = request.POST.get('url', None)
  srhUseYn = request.POST.get('useYn', None)

  print('=================================================')
  print('메뉴명     =>', srhMenuName)
  print('URL       =>', srhUrl)
  print('사용여부   =>', srhUseYn)

  if srhUseYn == '1':
    srhUseYn = 'Y'
  else:
    srhUseYn = 'N'

  # 화면별 코드 및 메시지 전달 변수  
  vResult = {'cd' : 'S', 'msg' : ''}

  # 조건 일치 데이터 menu_name_ko = 'esm_sys_1020'      : SysMenu.objects.filter(menu_name_ko='esm_sys_1020')
  # 조건 외 데이터 menu_name_ko != 'esm_sys_1020'       : SysMenu.objects.exclude(menu_name_ko='esm_sys_1020')
  # 특정 문자열 menu_name_ko like '%sys%' (대소구분)     : SysMenu.objects.filter(menu_name_ko__contains="sys")
  # 특정 문자열 UPPER(menu_name_ko) like upper('%sys%') : SysMenu.objects.filter(menu_name_ko__icontains="sys")
  # 시작 문자열 menu_name_ko like 'esm%'                : SysMenu.objects.filter(menu_name_ko__startswith="esm")
  # 종료 문자열 menu_name_ko like '%020'                : SysMenu.objects.filter(menu_name_ko__endswith="020")
  # 큰 값 age > 100                                     : SysMenu.objects.filter(age__gt=100)
  # 작은 값 age < 100                                   : SysMenu.objects.filter(age__lt=100)
  # 특정 문자열 menu_name_ko like '%sys%' (대소구분)     : SysMenu.objects.filter(menu_name_ko__exact="sys")
  # 특정 문자열 menu_name_ko like '%sys%'               : SysMenu.objects.filter(menu_name_ko__iexact="sys")
  # 특정 문자열 menu_name_ko is null                              : SysMenu.objects.filter(menu_name_ko__isnull=False)
  # 특정 문자열 menu_name_ko in ('esm_sys_1010', 'esm_sys_1020')  : SysMenu.objects.filter(menu_name_ko__in=['esm_sys_1010', 'esm_sys_1020'])
  # 날짜 년도   to_date(hire_date, 'yyyy') = '2000'               : SysMenu.objects.filter(hire_date__year=2000)
  # 날짜 월   to_date(hire_date, 'mm') = '2000'                   : SysMenu.objects.filter(hire_date__month=02)
  # 날짜 월   to_date(hire_date, 'dd') = '2000'                   : SysMenu.objects.filter(hire_date__day=01)


  try:
    queryset = SysMenu.objects.filter( \
        (Q(menu_name_ko__iexact=srhMenuName) | Q(menu_name_en__iexact=srhMenuName)) \
       & Q(url__iexact=srhUrl)
    )
    # 메뉴 데이터 조회
    if not queryset.exists():
      raise Exception(message.esmErrMsg(1020), 'kor') #'message.UserLangCd.langCd')
    else:
      print('query ->', queryset.query)
      # 메뉴 데이터 확인
      for ca in queryset:
        print('menu_id =>', ca.menu_id, 'menu_name_ko =>', ca.menu_name_ko, 'url =>', ca.url, 'user_yn =>', ca.use_yn)

  except Exception as e:
    vResult = {'cd' : 'E', 'msg' : e}
		
  print('cd =>', vResult['cd'])
  print('msg =>',vResult['msg'])
  # print(queryset.values('menu_id', 'menu_name_ko').order_by('sort_order'))
  serialized_queryset = serializers.serialize('json', queryset)
  # 그리드에 데이터를 전달
  # 1. 데이터가 존재하지 않을 경우
  # 2. 데이터가 1건 이상일 경우 그리드에 표기
  return JsonResponse(serialized_queryset, safe=False)
  
  

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
