from django.http.response import HttpResponseRedirect, JsonResponse
from django.shortcuts import  render
from django.core import serializers

# 장고 모델에서 필터 처리를 위한 Q 클래스 임포트
from django.db.models import Q

# 데이터베이스 트랜잭션 관리 임포트
from django.db import transaction

# esm_com 예외처리 및 메시지 함수 임포트
from esm_com.lang import langMsg
from esm_com.util import resultMsg, changeYn

# 로그인 모델 내 SysMenu 클래스 임포트
from . models import SysMenuV

# 임포트 UUID 클래스
from . orm import JsonData, doInsert, doUpdate, doDelete

from tkinter import *
from tkinter import messagebox


# #################################################################################################
# # Create your views here.
# #################################################################################################
# 메뉴 클릭 후 첫 화면 오픈
def home(request):
  return render(request, 'esm_sys/esm_sys_1020.html')


# #################################################################################################
# 조회 버튼
# #################################################################################################
def doSearch(request):
  # 화면에서 검색조건의 값
  srhMenuName = request.POST.get('menuName', None)
  srhUrl = request.POST.get('url', None)
  srhUseYn = request.POST.get('useYn', None)

  # 여부(1/0 -> Y/N) 값 변환
  srhUseYn = changeYn('YN', srhUseYn)

  # 화면별 코드 및 메시지 전달 변수
  commParams = {'cd': 'S', 'msg': '', 'processCnt': {'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}}

  try:
    querySet = SysMenuV.objects.filter(
         Q(menu_name_ko__icontains=srhMenuName) | Q(menu_name_ko__icontains=srhMenuName)
        ,Q(url__icontains=srhUrl)
        ,Q(use_yn=srhUseYn)
    ).order_by('menu_name_ko')

    # 그리드 조회된 데이터 건수 표기
    commParams['processCnt']['S'] = querySet.count()

    # [정상] 데이터가 존재하지 않음
    if not querySet.exists():
      langMsg.msgParam['errNum'] = 'ERR-1020'
      raise langMsg.noDataFound(langMsg.errMsg())

  except langMsg.noDataFound as e:
    commParams = {'cd' : 'S', 'msg' : e, 'processCnt': {'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}}
  except Exception as e:
    commParams = {'cd' : 'E', 'msg' : e.args[0], 'processCnt': {'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}}

  # 화면 처리 후 정상 및 오류 메시지 출력
  resultMsg(commParams)

  serialized_queryset = serializers.serialize('json', querySet)
  return JsonResponse(serialized_queryset, safe=False)


# #################################################################################################
# 저장 버튼
# #################################################################################################
def doSave(request):
  # 화면별 코드 및 메시지 전달 변수
  commParams = {'cd': 'S', 'msg': '', 'processCnt': {'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}}

  # 세션 데이터 조회, 현재 안되고 있음
  #userId = request.get['user_id']
  userID = -1000

  # one 트랜잭션 설정을 위한 세이브포인트 할당
  with transaction.atomic():
    try:
      # 삭제 데이터가 존재하면 저장
      if JsonData.deleteDataList is not None:
        commParams = doDelete(JsonData.deleteDataList, commParams)

        # 오류가 발생하면 롤백처리
        if commParams['cd'] == 'E':
          raise langMsg.userException(commParams['msg'])

      # 신규 데이터가 존재하면 저장
      if JsonData.insertDataList is not None:
        commParams = doInsert(JsonData.insertDataList, commParams, userID)

        # 오류가 발생하면 롤백처리
        if commParams['cd'] == 'E':
          raise langMsg.userException(commParams['msg'])

      # 수정 데이터가 존재하면 저장
      if JsonData.updateDataList is not None:
        commParams = doUpdate(JsonData.updateDataList, commParams, userID)

        # 오류가 발생하면 롤백처리
        if commParams['cd'] == 'E':
          raise langMsg.userException(commParams['msg'])

    except langMsg.userException as e:
      commParams = {'cd' : 'E', 'msg' : e.args[0], 'processCnt': {'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}}
    except Exception as e:
      commParams = {'cd' : 'E', 'msg' : e.args[0], 'processCnt': {'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}}

  # 화면 처리 후 정상 및 오류 메시지 출력
  if commParams['cd'] == 'S':
    commParams['msg'] = ''
  resultMsg(commParams)

  return HttpResponseRedirect('esm_sys_1010.html')
  # 여기는 어케 처리해야 되는지 도움말좀 달아 주세요.
  # 저장 후 콜백 처리되어서 데이터를 다시 조회 필요
  # 수정 건의 경우 해당 그리드 라인으로 포커싱 되도록 로직 추가 필요

  #serialized_queryset = serializers.serialize('json', dataSet)
  #return JsonResponse(serialized_queryset, safe=False)


# #################################################################################################
# 출력 버튼
# #################################################################################################
def doPrint(request):
  return render(request, 'esm_sys/esm_sys_1020.html')


# #################################################################################################
# 엑셀업로드 버튼
# #################################################################################################
def doExcelDown(request):
  return render(request, 'esm_sys/esm_sys_1020.html')


# #################################################################################################
# 엑셀다운로드 버튼
# #################################################################################################
def doExcelUp(request):
  return render(request, 'esm_sys/esm_sys_1020.html')
