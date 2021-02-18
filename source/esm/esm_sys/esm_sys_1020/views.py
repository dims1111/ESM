from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.core import serializers


# 장고 모델에서 필터 처리를 위한 Q 클래스 임포트
from django.db.models import Q

# esm_com 예외처리 및 메시지 함수 임포트
from esm_com.lang import langMag

# 로그인 모델 내 SysMenu 클래스 임포트
from . models import SysMenu

# 시간 임포트
import datetime

# 데이터베이스 트랜잭션 관리 임포트
from django.db import transaction


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

  # 여부(1/0 -> Y/N) 값 변환 
  if srhUseYn == '1':
    srhUseYn = 'Y'
  else:
    srhUseYn = 'N'

  # 화면별 코드 및 메시지 전달 변수  
  commParam = {'cd' : 'S', 'msg' : ''}

  # 조건 일치 데이터 menu_name_ko = 'esm_sys_1020'                : SysMenu.objects.filter(menu_name_ko='esm_sys_1020')
  # 조건 외 데이터 menu_name_ko != 'esm_sys_1020'                 : SysMenu.objects.exclude(menu_name_ko='esm_sys_1020')
  # 특정 문자열 menu_name_ko like '%sys%' (대소구분)               : SysMenu.objects.filter(menu_name_ko__contains="sys")
  # 특정 문자열 UPPER(menu_name_ko) like upper('%sys%')           : SysMenu.objects.filter(menu_name_ko__icontains="sys")
  # 시작 문자열 menu_name_ko like 'esm%'                          : SysMenu.objects.filter(menu_name_ko__startswith="esm")
  # 종료 문자열 menu_name_ko like '%020'                          : SysMenu.objects.filter(menu_name_ko__endswith="020")
  # 큰 값 age > 100                                               : SysMenu.objects.filter(age__gt=100)
  # 작은 값 age < 100                                             : SysMenu.objects.filter(age__lt=100)
  # 특정 문자열 menu_name_ko like '%sys%' (대소구분)              : SysMenu.objects.filter(menu_name_ko__exact="sys")
  # 특정 문자열 menu_name_ko like '%sys%'                         : SysMenu.objects.filter(menu_name_ko__iexact="sys")
  # 특정 문자열 menu_name_ko is null                              : SysMenu.objects.filter(menu_name_ko__isnull=False)
  # 특정 문자열 menu_name_ko in ('esm_sys_1010', 'esm_sys_1020')  : SysMenu.objects.filter(menu_name_ko__in=['esm_sys_1010', 'esm_sys_1020'])
  # 날짜 년도   to_date(hire_date, 'yyyy') = '2000'               : SysMenu.objects.filter(hire_date__year=2000)
  # 날짜 월   to_date(hire_date, 'mm') = '2000'                   : SysMenu.objects.filter(hire_date__month=02)
  # 날짜 월   to_date(hire_date, 'dd') = '2000'                   : SysMenu.objects.filter(hire_date__day=01)

  try:
    queryset = SysMenu.objects.filter(
         Q(menu_name_ko__icontains=srhMenuName) | Q(menu_name_ko__icontains=srhMenuName)
        ,Q(url__icontains=srhUrl)
        ,Q(use_yn=srhUseYn)
    ).order_by('menu_name_ko')

    # 그리드 조회된 데이터 건수 표기
    langMag.title['main'] = '(' + str(queryset.count()) + ')'
    commParam['msg'] = langMag.title

    # 쿼리 문장 확인
    print('query ->', queryset.query)

    # 데이터 확인 및 로직 처리
    # for ca in queryset:
    #   print('menu_id =>', ca.menu_id, 'menu_name_ko =>', ca.menu_name_ko, 'url =>', ca.url, 'user_yn =>', ca.use_yn)

    # [정상] 데이터가 존재하지 읺음
    if not queryset.exists():
      langMag.msgParam['errNum'] = 1020
      raise langMag.no_data_found(langMag.errMsg())

  except langMag.no_data_found as e:
    commParam = {'cd' : 'S', 'msg' : e}
  except Exception as e:
    commParam = {'cd' : 'E', 'msg' : '[Error Info.] '.join(e.args)}
		
  print('===========================================================================')	
  print('cd =>', commParam['cd'])
  print('msg =>',commParam['msg'])
  print('===========================================================================')

  serialized_queryset = serializers.serialize('json', queryset)
  return JsonResponse(serialized_queryset, safe=False)
 

# 출력 버튼을 클릭
def doPrint(request):
  return render(request, 'esm_sys/esm_sys_1020.html')


# 트랜잭션 관리 방법 - 1. 세이브 포인트 방식, 2.데코레이트 방식
# 1. 세이브 포이트 방식 : 사용자 여러개의 데이터를 저장 처리 시 로직에 의해서 커밋 또는 롤백 처리 시 사용
# 2. 데코레이트 방식 : 해당 함수 내 오류가 없으면 자동 커밋, 오류가 존재하면 롤백 처리 (함수 위에 @transaction.atomic 작성)

# 저장 버튼을 클릭
# @transaction.atomic
def save(request):
  # 화면별 코드 및 메시지 전달 변수  
  commParam = {'cd' : 'S', 'msg' : ''}

  # 데이터 왔다 치고 
  dataType = 'I'
  now = datetime.datetime.now()

  print('dataType =>', dataType)

  # menu_id 시퀀스 테이블에서 가져오기 로직 추가 필요
  # 데이터베이스 일시 가져오기 로직 추가 필요


  # 트랜잭션 관리를 위한 세이브포인트 sid 할당
  sid = transaction.savepoint() 
  try:
    if dataType == 'I':
      dataSet = SysMenu(
         menu_id            = 9004                    # 메뉴ID"
        ,menu_name_ko       = '한글 메뉴명'            # 메뉴명(한글)
        ,menu_name_en       = 'English Menu Name'     # 메뉴명(영문)
        ,url                = '/esm_sys/esm_sys_9004' # URL
        ,parent_menu_id     = 7100                    # 상위메뉴ID
        ,icons              = ''                      # 아이콘
        ,sort_order         = 7134                    # 정렬순서
        ,use_yn             = 'Y'                     # 사용여부(Y/N)
        ,search_yn          = 'Y'                     # 조회여부(Y/N)
        ,insert_yn          = 'Y'                     # 신규여부(Y/N)
        ,update_yn          = 'Y'                     # 수정여부(Y/N)
        ,delete_yn          = 'Y'                     # 삭제여부(Y/N)
        ,print_yn           = 'Y'                     # 출력여부(Y/N)
        ,batch_yn           = 'Y'                     # 생성여부(Y/N)
        ,excel_down_yn      = 'Y'                     # 엑셀다운로드여부
        ,excel_up_yn        = 'Y'                     # 엑셀업로드여부
        ,remark             = '테스트 메뉴 입력4'       # 비고
        ,create_date_time   = now                     # 생성일시
        ,create_by          = 1                       # 생성자ID
        ,update_date_time   = now                     # 수정일시
        ,update_by          = 1                       # 생성자ID
      )    
      print('dataSet =>', dataSet, type(dataSet))
      # 데이터 저장
      dataSet.save()

      # 데이터 커밋
      transaction.savepoint_commit(sid)
      print('dataSet.save() 저장 완료~~~~~~~~~~~~~~~~~~')      

  except Exception as e:
    commParam = {'cd' : 'E', 'msg' : '[Error Info.] '.join(e.args)}
    # 데이터 롤백
    transaction.savepoint_rollback(sid)

  print('===========================================================================')	
  print('cd =>', commParam['cd'])
  print('msg =>',commParam['msg'])
  print('===========================================================================')	

  # 여기는 어케 처리해야 되는지 도움말좀 달아 주세요.
  # 저장 후 콜백 처리되어서 데이터를 다시 조회 필요
  # 수정 건의 경우 해당 그리드 라인으로 포커싱 되도록 로직 추가 필요  
  serialized_queryset = serializers.serialize('json', dataSet)
  return JsonResponse(serialized_queryset, safe=False)


# 엑셀업로드 버튼을 클릭
def excelDown(request):
  return render(request, 'esm_sys/esm_sys_1020.html')  

# 엑셀다운로드 버튼을 클릭
def excelUp(request):
  return render(request, 'esm_sys/esm_sys_1020.html')
