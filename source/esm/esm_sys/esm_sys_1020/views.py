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

# 임포트 json 클랙스
import json

# 임포트 UUID 클래스
import uuid


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

  except langMag.noDataFound as e:
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


  # 세션 및 json 데이터 넘겨받기  
  #userId = request.get['user_id']  
  userID = -1000


  # 데이터베이스 일시 가져오기 로직 추가 필요
  now = datetime.datetime.now()

  # 화면 그리드에서 넘겨준 json 데이터 형식
  # 레벨1 : dataSet으로 고정
  # 레벨2 : I, U, D로 구분
  # 레벨3 : I, U의 경우 항목별 값 모두 넘기기
  #         D의 경우 Pirimary Key 값 넘기기
  # 결론 : 그리드에서 넘길 경우 I, U, D를 그룹핑 하여 넘기기 
  jsonObject = '''
  {
    "dataSet":
		{
			"I":
				[
					{ "menu_id": ""
            ,"menu_cd": "ML9100"
            ,"menu_name_ko": "한글 메뉴명-ML9100"
            ,"menu_name_en": "English Menu Name-ML9100"
            ,"url": "/esm_sys/esm_sys_9100"
            ,"parent_menu_cd": "ML7500"
            ,"icons": ""
            ,"sort_order": 9100
            ,"use_yn": "Y"
            ,"search_yn": "Y"
            ,"insert_yn": "Y"
            ,"update_yn": "Y"
            ,"delete_yn": "Y"
            ,"print_yn": "Y"
            ,"batch_yn": "Y"
            ,"excel_down_yn": "Y"
            ,"excel_up_yn": "Y"
            ,"remark": "테스트 메뉴 입력-ML9100"
            ,"create_date_time": "2021-02-08 22:15:12"
            ,"create_by": -1
            ,"update_date_time" : "2021-02-08 22:15:16"
            ,"update_by": -1
          },
					{ "menu_id": ""
            ,"menu_cd": "ML9200"
            ,"menu_name_ko": "한글 메뉴명-ML9200"
            ,"menu_name_en": "English Menu Name-ML9200"
            ,"url": "/esm_sys/esm_sys_9200"
            ,"parent_menu_cd": "ML7500"
            ,"icons": ""
            ,"sort_order": 9100
            ,"use_yn": "Y"
            ,"search_yn": "Y"
            ,"insert_yn": "N"
            ,"update_yn": "N"
            ,"delete_yn": "Y"
            ,"print_yn": "N"
            ,"batch_yn": "Y"
            ,"excel_down_yn": "Y"
            ,"excel_up_yn": "N"
            ,"remark": "테스트 메뉴 입력-ML9200"
            ,"create_date_time": "2021-02-08 23:15:12"
            ,"create_by": -2
            ,"update_date_time" : "2021-02-08 23:15:13"
            ,"update_by": -2
          }
				],
      "U":
				[
					{ "menu_uid": "f64bcf82e8194b8bb10b3a3e76a92a91"
            ,"menu_cd": "ML9100"
            ,"menu_name_ko": "한글 메뉴명-ML9100-update"
            ,"menu_name_en": "English Menu Name-ML9100-update"
            ,"url": "/esm_sys/esm_sys_9100-update"
            ,"parent_menu_cd": "ML7500"
            ,"icons": "1"
            ,"sort_order": 9101
            ,"use_yn": "Y"
            ,"search_yn": "N"
            ,"insert_yn": "N"
            ,"update_yn": "Y"
            ,"delete_yn": "N"
            ,"print_yn": "N"
            ,"batch_yn": "N"
            ,"excel_down_yn": "Y"
            ,"excel_up_yn": "N"
            ,"remark": "테스트 메뉴 입력-ML9100-update"
            ,"update_date_time" : "2021-02-08 23:22:13"
            ,"update_by": -12
          },
					{ "menu_uid": "696d5dcdfdcc4e6ba1bb6b11539f7c49"
            ,"menu_cd": "ML9200"
            ,"menu_name_ko": "한글 메뉴명-ML9200-update"
            ,"menu_name_en": "English Menu Name-ML9200-update"
            ,"url": "/esm_sys/esm_sys_9200-update"
            ,"parent_menu_cd": "ML7500"
            ,"icons": "2"
            ,"sort_order": 9102
            ,"use_yn": "Y"
            ,"search_yn": "Y"
            ,"insert_yn": "Y"
            ,"update_yn": "N"
            ,"delete_yn": "N"
            ,"print_yn": "N"
            ,"batch_yn": "N"
            ,"excel_down_yn": "Y"
            ,"excel_up_yn": "N"
            ,"remark": "테스트 메뉴 입력-ML9200-update"
            ,"update_date_time" : "2021-02-08 23:33:44"
            ,"update_by": -22
          }
				],
      "D":
				[
					{ "menu_uid": "4c4bb247b34144eb869dc75b03be4633" },
					{ "menu_uid": "4824085222c74375a7553628c5e0c6d3" }
				]  
		}
  }
  '''

  # json 매개변수 값 추출
  dataObject = json.loads(jsonObject)

  # json 데이터에서 신규/수정/삭제 데이터 추출  
  insertDataList = dataObject.get("dataSet").get('I')
  updateDataList = dataObject.get("dataSet").get('U')
  deleteDataList = dataObject.get("dataSet").get('D')
  
  # one 트랜잭션 설정을 위한 세이브포인트 할당
  with transaction.atomic():
    try:
      # 삭제 데이터가 존재하면 저장        
      if deleteDataList is not None:
        commParam = doDelete(deleteDataList, commParam)

        # 오류가 발생하면 롤백처리 
        if commParam['cd'] == 'E':
          raise langMag.userException(commParam['msg'])

      # 신규 데이터가 존재하면 저장
      if insertDataList is not None:
        commParam = doInsert(commParam, insertDataList, userID, now)
        
        # 오류가 발생하면 롤백처리
        if commParam['cd'] == 'E':
          raise langMag.userException(commParam['msg'])
      
      # 수정 데이터가 존재하면 저장
      if updateDataList is not None:
        commParam = doUpdate(commParam, updateDataList, userID, now)
        
        # 오류가 발생하면 롤백처리
        if commParam['cd'] == 'E':
          raise langMag.userException(commParam['msg'])
 
    except langMag.userException as e:
      commParam = {'cd' : 'E', 'msg' : e.args[0]}
    except Exception as e:   
      commParam = {'cd' : 'E', 'msg' : e.args[0]}

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


# 신규 데이터 처리
@transaction.atomic
def doInsert(commParam, dataList, userID, now):
  try:
    i = 0
    bulkDataList = []    
    
    # dataList 데이터 확인
    for ca in dataList:      
      # 신규 메뉴 클래스 생성
      newData = SysMenu()

      # 신규 메뉴 클래스 항목별 값 할당
      newData.menu_uid          = None
      newData.menu_cd           = ca.get('menu_cd')
      newData.menu_name_ko      = ca.get('menu_name_ko')
      newData.menu_name_en      = ca.get('menu_name_en')
      newData.url               = ca.get('url')
      newData.parent_menu_cd    = ca.get('parent_menu_cd')
      newData.icons             = ca.get('icons')
      newData.sort_order        = ca.get('sort_order')
      newData.use_yn            = ca.get('use_yn')
      newData.search_yn         = ca.get('search_yn')
      newData.insert_yn         = ca.get('insert_yn')
      newData.update_yn         = ca.get('update_yn')
      newData.delete_yn         = ca.get('delete_yn')
      newData.print_yn          = ca.get('print_yn')
      newData.batch_yn          = ca.get('batch_yn')
      newData.excel_down_yn     = ca.get('excel_down_yn')
      newData.remark            = ca.get('remark')
      newData.create_date_time  = now
      newData.create_by         = userID
      newData.update_date_time  = now
      newData.update_by         = userID

      # 메뉴 클래스를 리스트에 추가      
      bulkDataList.append(newData)
      i += 1
     
    # 대량 데이터 일괄 저장    
    SysMenu.objects.bulk_create(bulkDataList)
    print('===========================================================================')
    print(str(i) + '건의 데이터를 저장하였습니다.')
    print('===========================================================================')

  except Exception as e:
    commParam = {'cd' : 'E', 'msg' : e.args[0]}
  return commParam


# 수정 처리
@transaction.atomic
def doUpdate(commParam, dataList, userID, now):
  try:
    i = 0
    
    # dataList 데이터 확인
    for ca in dataList:
      updateData = SysMenu.objects.filter(pk=ca.get('menu_uid'))

      if updateData.exists():
        updateData.menu_cd           = ca.get('menu_cd')
        updateData.menu_name_ko      = ca.get('menu_name_ko')
        updateData.menu_name_en      = ca.get('menu_name_en')
        updateData.url               = ca.get('url')
        updateData.parent_menu_cd    = ca.get('parent_menu_cd')
        updateData.icons             = ca.get('icons')
        updateData.sort_order        = ca.get('sort_order')
        updateData.use_yn            = ca.get('use_yn')
        updateData.search_yn         = ca.get('search_yn')
        updateData.insert_yn         = ca.get('insert_yn')
        updateData.update_yn         = ca.get('update_yn')
        updateData.delete_yn         = ca.get('delete_yn')
        updateData.print_yn          = ca.get('print_yn')
        updateData.batch_yn          = ca.get('batch_yn')
        updateData.excel_down_yn     = ca.get('excel_down_yn')
        updateData.remark            = ca.get('remark')
        updateData.update_date_time  = now
        updateData.update_by         = userID
        
        # 데이터 저장
        updateData.save()
        i += 1

    print('===========================================================================')
    print(str(i) + '건의 데이터를 수정하였습니다.')
    print('===========================================================================')

  except Exception as e:
    print("@@@@@ 수정 오류 @@@@@ ")
    commParam = {'cd' : 'E', 'msg' : e.args[0]}
  return commParam


# 삭제 처리
def doDelete(dataList, commParam):
  try:    
    i = 0

    # dataList 데이터 확인
    for ca in dataList:      
      # 신규 메뉴 클래스 생성
      deleteData = SysMenu.objects.filter(pk=ca.get('menu_uid'))

      # 자료가 존재하면 삭제
      if deleteData.exists():
        deleteData.delete()
        i += 1

    print('===========================================================================')
    print(str(i) +'건의 데이터를 삭제하였습니다.')
    print('===========================================================================')

  except Exception as e:   
    print("@@@@@ 삭제 오류 @@@@@ ")
    commParam = {'cd' : 'E', 'msg' : e.args[0]}
  return commParam


# 엑셀업로드 버튼
def doExcelDown(request):
  return render(request, 'esm_sys/esm_sys_1020.html')
  

# 엑셀다운로드 버튼
def doExcelUp(request):
  return render(request, 'esm_sys/esm_sys_1020.html')
