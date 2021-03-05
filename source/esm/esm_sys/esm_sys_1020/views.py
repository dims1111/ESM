# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_sys_1020
# 프로그램 Name : 메뉴등록
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# #################################################################################################
import json
from django.http.response import JsonResponse
from django.shortcuts import render

# 장고 모델에서 필터 처리를 위한 Q 클래스 임포트
from django.db.models import Q

# 데이터베이스 트랜잭션 관리 임포트
from django.db import transaction

# esm_com 예외처리 및 메시지 함수 임포트
from esm_com.lang import langMsg

# 사용자 함수 클래스 임포트
from esm_com import util

# 로그인 모델 내 SysMenu 클래스 임포트
from . models import SysMenuV

# orm 파일 내 클래스 임포트
from . orm import doInsert, doUpdate, doDelete


# 메뉴 클릭 후 첫 화면 오픈
@util.sessionDecorator
def home(request, *args, **kwargs):  
  # sessionDecorator 데코레이터를 통한 매개변수 버튼명칭을 확인 : 튜풀
  # for ca in args:
  #   print("args==========>", ca)

  # sessionDecorator 데코레이터를 통한 버튼의 명칭 및 값을 확인(사용여부) : 딕셔너리
  # for k, v in kwargs['buttonShowHide'].items():
  #   print("kwargs - 버튼명칭 ==>", k, "kwargs - 사용여부 ==>", v)

  # kwargs 리턴 값을 받아 화면에서 버튼 show, hide 처리
  return render(request, 'esm_sys/esm_sys_1020.html', kwargs)


# #################################################################################################
# 조회 버튼
# #################################################################################################
@util.sessionDecorator
def doSearch(request, *args, **kwargs):
  # 화면별 코드 및 메시지 전달 변수 값 초기화
  commParams = kwargs['commParams']
  
  # 화면에서 검색조건의 값
  srhMenuName = request.POST.get('menuName', None)
  srhUrl = request.POST.get('url', None)
  srhUseYn = util.changeYn('YN', request.POST.get('useYn', None))

  # 조회조건에 일치하는 데이터 검색
  try:
    querySet = SysMenuV.objects.filter(
         Q(menu_name_ko__icontains=srhMenuName) | Q(menu_name_ko__icontains=srhMenuName)
        ,Q(url__icontains=srhUrl)
        ,Q(use_yn=srhUseYn)
    ).order_by('menu_name_ko')

    # 조회된 데이터 건수
    commParams['processCnt']['S'] = querySet.count()

    # [정상] 데이터가 존재하지 않음
    if not querySet.exists():
      langMsg.msgParam['errNum'] = 'ERR-1020'
      raise langMsg.noDataFound(langMsg.errMsg())

    # 화면에 리턴할 데이터를 commParams['data'] 할당
    if querySet.exists():  
      commParams['data'] = list(querySet.values(
        'menu_uid',
        'menu_cd',
        'menu_name_ko',
        'menu_name_en',
        'url',
        'parent_menu_cd',
        'icons',
        'sort_order',
        'use_yn',
        'search_yn',
        'add_row_yn',
        'del_row_yn',
        'save_yn',
        'copy_yn',
        'batch_yn',
        'print_yn',
        'excel_down_yn',
        'excel_up_yn',
        'remark',
        'create_by',
        'create_date_time',
        'update_date_time',
        'update_by'
      ))
  except langMsg.noDataFound as e:
    commParams['cd'] = 'S'
    commParams['msg'] = e.args[0]
  except Exception as e:
    commParams['cd'] = 'E'
    commParams['msg'] = '[오류내용] 시스템 오류가 발생하였습니다.<br>[오류상세] ' + e.args[0]
 
  # 서버에서 처리한 결과를 터미널에 출력  
  util.resultMsg(commParams)

  # json을 통하여 commParams 데이터(공통메시지 및 조회결과)를 화면으로 전달
  return JsonResponse(commParams)


# #################################################################################################
# 저장 버튼
# #################################################################################################
@util.sessionDecorator
def doSave(request, *args, **kwargs):
  # 화면별 코드 및 메시지 전달 변수 값 초기화
  commParams = kwargs['commParams']  

  # 사용자정보 할당
  commParams['userInfo'] = {'userId': request.session['user_id']}
  
  try:    
    json_data = json.loads(request.body)
    # print("json_data =>", json_data)

    insertedData = json_data.get('grid1').get('created')
    updatedData = json_data.get('grid1').get('updated')
    deletedData = json_data.get('grid1').get('deleted')

    # one 트랜잭션 설정을 위한 세이브포인트 할당
    with transaction.atomic():
      # 삭제 데이터가 존재하면 저장
      if deletedData is not None:
        commParams = doDelete(deletedData, commParams)
        # 오류가 발생하면 롤백처리
        if commParams['cd'] == 'E':
          raise langMsg.userException(commParams['msg'])

      # 신규 데이터가 존재하면 저장
      if insertedData is not None:
        commParams = doInsert(insertedData, commParams)
        # 오류가 발생하면 롤백처리
        if commParams['cd'] == 'E':
          raise langMsg.userException(commParams['msg'])

      # 수정 데이터가 존재하면 저장
      if updatedData is not None:
        commParams = doUpdate(updatedData, commParams)
        # 오류가 발생하면 롤백처리
        if commParams['cd'] == 'E':
          raise langMsg.userException(commParams['msg'])

    # 화면 처리 후 정상 및 오류 메시지 출력
    if commParams['cd'] == 'S':
      langMsg.msgParam['errNum'] = 'INF-1000'
      commParams['msg'] = langMsg.errMsg()

  except (langMsg.userException, Exception) as e:
    commParams['msg'] = str(e)

  # 서버에서 처리한 결과를 터미널에 출력
  util.resultMsg(commParams)

  # json을 통하여 commParams 데이터(공통메시지 및 조회결과)를 화면으로 전달
  return JsonResponse(commParams)


# #################################################################################################
# 출력 버튼
# #################################################################################################
@util.sessionDecorator
def doPrint(request, *args, **kwargs):
  return render(request, 'esm_sys/esm_sys_1020.html')


# #################################################################################################
# 엑셀업로드 버튼
# #################################################################################################
@util.sessionDecorator
def doExcelDown(request, *args, **kwargs):
  return render(request, 'esm_sys/esm_sys_1020.html')