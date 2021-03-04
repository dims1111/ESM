# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_pop_1000
# 프로그램 Name : 공통 팝업
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# #################################################################################################
from django.http.response import JsonResponse
from django.shortcuts import render

# 오라클 접속하기 위한 패키지 임포트
import cx_Oracle

# 공통 쿼리 클랙스 임포트
from . query import sql

# query 실행을 위한 클래스 임포트
from esm_com import views as esmComViews

# 사용자 함수 클래스 임포트
from esm_com import util


# 메뉴 클릭 후 첫 화면 오픈
@util.sessionDecorator
def home(request, *args, **kwargs):
  if request.POST.get('popupName') == 'codeDetail':
    return render(request, 'esm_pop/esm_pop_1000.html', kwargs)
  elif request.POST.get('popupName') == 'codeDetail':
    pass

# 공통코드 조회
@util.sessionDecorator
def searchCodeDetail(request, *args, **kwargs):
  # 화면별 코드 및 메시지 전달 변수 값 초기화
  commParams = kwargs['commParams']

  try:
    print("request.session.is_empty()", request.POST.get('searchMasterCd', None))

    dictParams = {}
    dictParams["&p_lang_cd"] = request.session['lang_cd']
    dictParams["&p_master_cd"] = request.POST.get('searchMasterCd', None)

    # 공통코드 조회    
    commParams['data'] = esmComViews.searchExecute(sql.searchCodeDetail, dictParams)
    return JsonResponse(commParams)
    
  except Exception as e:
    return JsonResponse( {'cd' : 'E', 'msg' : str(e)} )