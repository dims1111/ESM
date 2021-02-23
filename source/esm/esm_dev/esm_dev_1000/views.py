from django.http.response import HttpResponseRedirect, JsonResponse
from django.shortcuts import render, HttpResponse
from django.core import serializers

# 장고 모델에서 필터 처리를 위한 Q 클래스 임포트
from django.db.models import Q

# 데이터베이스 트랜잭션 관리 임포트
from django.db import transaction

# esm_com 예외처리 및 메시지 함수 임포트
from esm_com.lang import langMsg

# 사용자 함수 클래스 임포트
from esm_com import util

# 로그인 모델 내 SysMenu 클래스 임포트
from esm_sys.esm_sys_1020.models import SysMenuV

# orm 파일 내 클래스 임포트
from esm_sys.esm_sys_1020.orm import JsonData, doInsert, doUpdate, doDelete

# 데코레이트 클래스 임포트
from django.utils.decorators import method_decorator
import json

# #################################################################################################
# # Create your views here.
# #################################################################################################
# 메뉴 클릭 후 첫 화면 오픈
@util.sessionDecorator
def home(request):
    return render(request, 'esm_dev/esm_dev_1000.html')


# #################################################################################################
# 조회 버튼
# #################################################################################################
@util.sessionDecorator
def doSearch(request):
    # 화면에서 검색조건의 값
    srhMenuName = request.POST.get('menuName', None)
    srhUrl = request.POST.get('url', None)
    srhUseYn = request.POST.get('useYn', None)

    # 여부(1/0 -> Y/N) 값 변환
    srhUseYn = util.changeYn('YN', srhUseYn)

    # 화면별 코드 및 메시지 전달 변수
    commParams = {'cd': 'S', 'msg': '', 'processCnt': {
        'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}}

    try:
        querySet = SysMenuV.objects.filter(
            Q(menu_name_ko__icontains=srhMenuName) | Q(menu_name_ko__icontains=srhMenuName), Q(
                url__icontains=srhUrl), Q(use_yn=srhUseYn)
        ).order_by('menu_name_ko')

        # 조회된 데이터 건수 표기
        commParams['processCnt']['S'] = querySet.count()

        # [정상] 데이터가 존재하지 않음
        if not querySet.exists():
            langMsg.msgParam['errNum'] = 'ERR-1020'
            raise langMsg.noDataFound(langMsg.errMsg())

    except langMsg.noDataFound as e:
        commParams = {'cd': 'S', 'msg': e, 'processCnt': {
            'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}}
    except Exception as e:
        commParams = {'cd': 'E', 'msg': e.args[0], 'processCnt': {
            'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}}

    # 화면 처리 후 정상 및 오류 메시지 출력
    util.resultMsg(commParams)

    serialized_queryset = serializers.serialize('json', querySet)
    return JsonResponse(serialized_queryset, safe=False)


# #################################################################################################
# 저장 버튼
# #################################################################################################
@util.sessionDecorator
def doSave(request):
    # 화면별 코드 및 메시지 전달 변수
    commParams = {'cd': 'S', 'msg': '', 'processCnt': {
        'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}}

    user_id = request.session['user_id']
    json_data = json.loads(request.body)
    print(json_data)

    # one 트랜잭션 설정을 위한 세이브포인트 할당
    with transaction.atomic():
        try:
            insertedData = json_data.get('grid1').get('inserted')
            updatedData = json_data.get('grid1').get('updated')
            deletedData = json_data.get('grid1').get('deleted')
            # 삭제 데이터가 존재하면 저장
            if deletedData is not None:
                commParams = doDelete(deletedData, commParams)

                # 오류가 발생하면 롤백처리
                if commParams['cd'] == 'E':
                    raise langMsg.userException(commParams['msg'])

            # 신규 데이터가 존재하면 저장
            if insertedData is not None:
                commParams = doInsert( insertedData, commParams, user_id)

                # 오류가 발생하면 롤백처리
                if commParams['cd'] == 'E':
                    raise langMsg.userException(commParams['msg'])

            # 수정 데이터가 존재하면 저장
            if updatedData is not None:
                commParams = doUpdate( updatedData, commParams, user_id)

                # 오류가 발생하면 롤백처리
                if commParams['cd'] == 'E':
                    raise langMsg.userException(commParams['msg'])

        except langMsg.userException as e:
            commParams = {'cd': 'E', 'msg': e.args[0], 'processCnt': {
                'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}}

        except Exception as e:
            commParams = {'cd': 'E', 'msg': e.args[0], 'processCnt': {
                'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}}

    # 화면 처리 후 정상 및 오류 메시지 출력
    if commParams['cd'] == 'S':
        commParams['msg'] = ''
    util.resultMsg(commParams)
 
    return JsonResponse({'code': 0, 'message': "처리됨"})
    # 여기는 어케 처리해야 되는지 도움말좀 달아 주세요.
    # 저장 후 콜백 처리되어서 데이터를 다시 조회 필요
    # 수정 건의 경우 해당 그리드 라인으로 포커싱 되도록 로직 추가 필요

    #serialized_queryset = serializers.serialize('json', dataSet)
    # return JsonResponse(serialized_queryset, safe=False)


# #################################################################################################
# 출력 버튼
# #################################################################################################
@util.sessionDecorator
def doPrint(request):
    return render(request, 'esm_sys/esm_sys_1020.html')


# #################################################################################################
# 엑셀업로드 버튼
# #################################################################################################
@util.sessionDecorator
def doExcelDown(request):
    return render(request, 'esm_sys/esm_sys_1020.html')


# #################################################################################################
# 엑셀다운로드 버튼
# #################################################################################################
@util.sessionDecorator
def doExcelUp(request):
    return render(request, 'esm_sys/esm_sys_1020.html')
