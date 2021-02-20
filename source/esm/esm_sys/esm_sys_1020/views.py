from django.http.response import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect, render
from django.core import serializers


# 장고 모델에서 필터 처리를 위한 Q 클래스 임포트
from django.db.models import Q

# esm_com 예외처리 및 메시지 함수 임포트
from esm_com.lang import langMag

# 로그인 모델 내 SysMenu 클래스 임포트
from . models import SysMenu, SysMenuV

# 시간 임포트
import datetime

# 데이터베이스 트랜잭션 관리 임포트
from django.db import transaction


# Create your views here.
# 메뉴 클릭 후 첫 화면 오픈
def home(request):  
  return render(request, 'esm_sys/esm_sys_1020.html')

# 조회 버튼
def doSearch(request):
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

  # 조건 일치 데이터 menu_name_ko = 'esm_sys_1020'                : SysMenuv.objects.filter(menu_name_ko='esm_sys_1020')
  # 조건 외 데이터 menu_name_ko != 'esm_sys_1020'                 : SysMenuv.objects.exclude(menu_name_ko='esm_sys_1020')
  # 특정 문자열 menu_name_ko like '%sys%' (대소구분)               : SysMenuv.objects.filter(menu_name_ko__contains="sys")
  # 특정 문자열 UPPER(menu_name_ko) like upper('%sys%')           : SysMenuv.objects.filter(menu_name_ko__icontains="sys")
  # 시작 문자열 menu_name_ko like 'esm%'                          : SysMenuv.objects.filter(menu_name_ko__startswith="esm")
  # 종료 문자열 menu_name_ko like '%020'                          : SysMenuv.objects.filter(menu_name_ko__endswith="020")
  # 큰 값 age > 100                                               : SysMenuv.objects.filter(age__gt=100)
  # 작은 값 age < 100                                             : SysMenuv.objects.filter(age__lt=100)
  # 특정 문자열 menu_name_ko like '%sys%' (대소구분)              : SysMenuv.objects.filter(menu_name_ko__exact="sys")
  # 특정 문자열 menu_name_ko like '%sys%'                         : SysMenuv.objects.filter(menu_name_ko__iexact="sys")
  # 특정 문자열 menu_name_ko is null                              : SysMenuv.objects.filter(menu_name_ko__isnull=False)
  # 특정 문자열 menu_name_ko in ('esm_sys_1010', 'esm_sys_1020')  : SysMenuv.objects.filter(menu_name_ko__in=['esm_sys_1010', 'esm_sys_1020'])
  # 날짜 년도   to_date(hire_date, 'yyyy') = '2000'               : SysMenuv.objects.filter(hire_date__year=2000)
  # 날짜 월   to_date(hire_date, 'mm') = '2000'                   : SysMenuv.objects.filter(hire_date__month=02)
  # 날짜 월   to_date(hire_date, 'dd') = '2000'                   : SysMenuv.objects.filter(hire_date__day=01)

  try:    
    querySet = SysMenuV.objects.filter(
         Q(menu_name_ko__icontains=srhMenuName) | Q(menu_name_ko__icontains=srhMenuName)
        ,Q(url__icontains=srhUrl)
        ,Q(use_yn=srhUseYn)
    ).order_by('menu_name_ko')

    # 그리드 조회된 데이터 건수 표기
    langMag.title['main'] = '(' + str(querySet.count()) + ')'
    commParam['msg'] = langMag.title

    # 쿼리 문장 확인
    # print('query ->', queryset.query)
    
    # 데이터 확인 및 로직 처리
    # for ca in queryset:
    #   print('menu_cd =>', ca.menu_cd, 'menu_name_ko =>', ca.menu_name_ko, 'url =>', ca.url, 'user_yn =>', ca.use_yn)

    # [정상] 데이터가 존재하지 않음
    if not querySet.exists():
      langMag.msgParam['errNum'] = 1020
      raise langMag.no_data_found(langMag.errMsg())

  except langMag.no_data_found as e:
    commParam = {'cd' : 'S', 'msg' : e}
  except Exception as e:
    commParam = {'cd' : 'E', 'msg' : e.args[0]}
		
  print('===========================================================================')	
  print('cd =>', commParam['cd'])
  print('msg =>',commParam['msg'])
  print('===========================================================================')

  serialized_queryset = serializers.serialize('json', querySet)
  return JsonResponse(serialized_queryset, safe=False)
 

# 출력 버튼
def doPrint(request):
  return render(request, 'esm_sys/esm_sys_1020.html')


# 트랜잭션 관리 방법 - 1. 세이브 포인트 방식, 2.데코레이트 방식
# 1. 세이브 포이트 방식 : 사용자 여러개의 데이터를 저장 처리 시 로직에 의해서 커밋 또는 롤백 처리 시 사용
# 2. 데코레이트 방식 : 해당 함수 내 오류가 없으면 자동 커밋, 오류가 존재하면 롤백 처리 (함수 위에 @transaction.atomic 작성)

# 저장 버튼
def doSave(request):
  # 화면별 코드 및 메시지 전달 변수  
  commParam = {'cd' : 'S', 'msg' : ''}

  # 데이터 왔다 치고 
  rowStatus = 'I'
  print('rowStatus =>', rowStatus)

  # 데이터베이스 일시 가져오기 로직 추가 필요
  now = datetime.datetime.now()

  # Json 데이터 처리
  params = {
	    {'key' : '7a25a64698a543c4845c6206e03badb7'
	     ,'data' : {
          'row_status'        : 'U'
	        ,'menu_cd'          : 'ML9000'
	        ,'menu_name_ko'     : '한글 메뉴명-ML9000'
	        ,'menu_name_en'     : 'English Menu Name-ML9000'
	        ,'url'              : '/esm_sys/esm_sys_9000'
	        ,'parent_menu_cd'   : 'ML7500'
	        ,'icons'            : ''
	        ,'sort_order'       : 9000
	        ,'use_yn'           : 'Y'
	        ,'search_yn'        : 'Y'
	        ,'insert_yn'        : 'Y'
	        ,'update_yn'        : 'Y'
	        ,'delete_yn'        : 'Y'
	        ,'print_yn'         : 'Y'
	        ,'batch_yn'         : 'Y'
	        ,'excel_down_yn'    : 'Y'
	        ,'excel_up_yn'      : 'Y'
	        ,'remark'           : '테스트 메뉴 입력-ML9000'
	        ,'create_date_time' : now
	        ,'create_by'        : -1
	        ,'update_date_time' : now
	        ,'update_by'        : -1
	        },
	    }
	   ,{
        'key' : ''
        ,'data' : {
           'row_status'       : 'I'
          ,'menu_cd'          : 'ML9010'
          ,'menu_name_ko'     : '한글 메뉴명-ML9010'
          ,'menu_name_en'     : 'English Menu Name-ML9000'
          ,'url'              : '/esm_sys/esm_sys_9010'
          ,'parent_menu_cd'   : 'ML7500'
          ,'icons'            : ''
          ,'sort_order'       : 9010
          ,'use_yn'           : 'Y'
          ,'search_yn'        : 'N'
          ,'insert_yn'        : 'N'
          ,'update_yn'        : 'N'
          ,'delete_yn'        : 'N'
          ,'print_yn'         : 'N'
          ,'batch_yn'         : 'N'
          ,'excel_down_yn'    : 'N'
          ,'excel_up_yn'      : 'N'
          ,'remark'           : '테스트 메뉴 입력-ML9010'
          ,'create_date_time' : now
          ,'create_by'        : -2
          ,'update_date_time' : now
          ,'update_by'        : -2
        }
      }
    }


  print(params, type(params))

  for ca in params.get('row_status'):
    print (ca)
  



  # 트랜잭션 관리를 위한 세이브포인트 sid 할당
  # sid = transaction.savepoint() 
  # if rowStatus == 'I':
  #   print("신규")
  #   commParam = doInsert(request, now)

  # elif rowStatus == 'D':
  #   print("삭제")
    # commParam = doDelete('85196e9c40f645ae975ef11c05564a54')
    # 메뉴 모델 오브젝트에서 키 값을 조회 후 변경 컬럼을 값 할당 후 저장
    # 삭제 했는데 왜 다시 업데이트도고, 인서트를 하지 흠냐 ...

    # elif rowStatus == 'U':
    #   print("수정")

    # 데이터 커밋    
    # transaction.savepoint_commit(sid)

  print('===========================================================================')	
  print('cd =>', commParam['cd'])
  print('msg =>',commParam['msg'])
  print('===========================================================================')	

  return HttpResponseRedirect('esm_sys_1010.html')
  # 여기는 어케 처리해야 되는지 도움말좀 달아 주세요.
  # 저장 후 콜백 처리되어서 데이터를 다시 조회 필요
  # 수정 건의 경우 해당 그리드 라인으로 포커싱 되도록 로직 추가 필요  
  
  #serialized_queryset = serializers.serialize('json', dataSet)
  #return JsonResponse(serialized_queryset, safe=False)


# 신규 처리
def doInsert(request, now):
  try:
    # SysMenu.objects.bulk_create(dataSet)
    dataSet = SysMenu(
       menu_cd                 = 'ML9000'                            # 메뉴코드
      ,menu_name_ko            = '한글 메뉴명-ML9000'                 # 메뉴명(한글)
      ,menu_name_en            = 'English Menu Name-ML9000'          # 메뉴명(영문)
      ,url                     = '/esm_sys/esm_sys_9000'             # URL
      ,parent_menu_cd          = 'ML7500'                            # 상위메뉴코드
      ,icons                   = ''                                  # 아이콘
      ,sort_order              = 9000                                # 정렬순서
      ,use_yn                  = 'Y'                                 # 사용여부(Y/N)
      ,search_yn               = 'Y'                                 # 조회여부(Y/N)
      ,insert_yn               = 'Y'                                 # 신규여부(Y/N)
      ,update_yn               = 'Y'                                 # 수정여부(Y/N)
      ,delete_yn               = 'Y'                                 # 삭제여부(Y/N)
      ,print_yn                = 'Y'                                 # 출력여부(Y/N)
      ,batch_yn                = 'Y'                                 # 생성여부(Y/N)
      ,excel_down_yn           = 'Y'                                 # 엑셀다운로드여부
      ,excel_up_yn             = 'Y'                                 # 엑셀업로드여부
      ,remark                  = '테스트 메뉴 입력-ML9000'            # 비고
      ,create_date_time        = now                                 # 생성일시
      ,create_by               = -1                                  # 생성자ID
      ,update_date_time        = now                                 # 수정일시
      ,update_by               = -1                                  # 생성자ID
    )

    # 데이터 저장
    with transaction.atomic():
      dataSet.save()    
      print('===========================================================================')
      print('정상적으로 데이터를 신규로 저장하였습니다.')
      print('===========================================================================')

  except Exception as e:   
    commParam = {'cd' : 'E', 'msg' : e.args[0]}
  return commParam


# 수정 처리
def doUpdate(updateSet, now):
  try:
    dataSet = SysMenu.objects.get(pk=updateSet)
    dataSet.menu_cd            = 'ML9000'                            # 메뉴코드
    dataSet.menu_name_ko       = '한글 메뉴명-7521'                   # 메뉴명(한글)
    dataSet.menu_name_en       = 'English Menu Name-7521'            # 메뉴명(영문)
    dataSet.url                = '/esm_sys/esm_sys_7521'             # URL
    dataSet.parent_menu_cd     = 'ML7500'                            # 상위메뉴코드
    dataSet.icons              = ''                                  # 아이콘
    dataSet.sort_order         = 9001                                # 정렬순서
    dataSet.use_yn             = 'Y'                                 # 사용여부(Y/N)
    dataSet.search_yn          = 'N'                                 # 조회여부(Y/N)
    dataSet.insert_yn          = 'N'                                 # 신규여부(Y/N)
    dataSet.update_yn          = 'N'                                 # 수정여부(Y/N)
    dataSet.delete_yn          = 'N'                                 # 삭제여부(Y/N)
    dataSet.print_yn           = 'N'                                 # 출력여부(Y/N)
    dataSet.batch_yn           = 'N'                                 # 생성여부(Y/N)
    dataSet.excel_down_yn      = 'N'                                 # 엑셀다운로드여부
    dataSet.excel_up_yn        = 'N'                                 # 엑셀업로드여부
    dataSet.remark             = '테스트 메뉴 입력-7521'              # 비고        
    dataSet.update_date_time   = now                                 # 수정일시
    dataSet.update_by          = -2                                  # 생성자ID
    
    # 데이터 저장
    with transaction.atomic():
      dataSet.save()

      print('===========================================================================')
      print('정상적으로 데이터를 수정하였습니다.')
      print('===========================================================================')

  except Exception as e:   
    commParam = {'cd' : 'E', 'msg' : e.args[0]}
  return commParam


# 삭제 처리
def doDelete(primaryKey):
  try:
    
    dataSet = SysMenu.objects.get(pk=primaryKey)
    
    with transaction.atomic():
      dataSet.delete()

      print('===========================================================================')
      print('정상적으로 데이터를 삭제하였습니다.')
      print('===========================================================================')

  except Exception as e:   
    commParam = {'cd' : 'E', 'msg' : e.args[0]}
  return commParam


# 엑셀업로드 버튼
def doExcelDown(request):
  return render(request, 'esm_sys/esm_sys_1020.html')
  

# 엑셀다운로드 버튼
def doExcelUp(request):
  return render(request, 'esm_sys/esm_sys_1020.html')
