# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_com
# 프로그램 Name : 시스템 공통 - 함수 및 클래스
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# #################################################################################################
# from django.shortcuts import  redirect, HttpResponseRedirect,
from django.http.response import HttpResponseRedirect, HttpResponse

# 장고 로그아웃 처리를 위한 클래스 임포트
from django.contrib.auth import logout as auth_logout

# 로그인 모델 내 SysMenu 클래스 임포트
from esm_sys.esm_sys_1020.models import SysMenuV

# 장고 모델에서 필터 처리를 위한 Q 클래스 임포트
from django.db.models import Q


# 화면 처리 후 정상 및 오류 메시지 출력
# 정상: cd='S', msg=''
# 오류: cd='E', msg='관련된 오류 내용이 출력됩니다.' 
def resultMsg(commParam):
  print('===========================================================================')
  print('code    →', commParam['cd'])
  print('message →', commParam['msg'])  
  print('search  →', commParam['processCnt']['S'])
  print('insert  →', commParam['processCnt']['I'])
  print('update  →', commParam['processCnt']['U'])
  print('delete  →', commParam['processCnt']['D'])
  print('batch   →', commParam['processCnt']['B'])
  print('===========================================================================')


# 여부(1/0 <-> Y/N) 값 변환
def changeYn(case, value):    
  # Y, N 으로 변환
  if case == 'YN':
    if value == '1':
      return 'Y'
    else:
      return 'N'
  
  # 1, 0 으로 변환
  elif case == '10':
    if value == 'Y':
      return '1'
    else:
      return '0'


# 커서를 List Dictionary 형태로 변환
def rowsToDictList(cursor):
	columns = [camelCase(i[0]) for i in cursor.description]
	return [dict(zip(columns, row)) for row in cursor]


# 문자 카멜케이스로 변경
def camelCase(strValue):
  output = ''.join(x for x in strValue.title() if x.isalnum())
  return output[0].lower() + output[1:]


# 세션 데코레이트
def sessionDecorator(orginalFunction):
  def wrapperFunction(request, *args, **kwargs):
    # 사용자 세션 정보 오류일 경우 로그인 화면으로 이동
    if request.session.get('user_id') is None:
      # 테스트 : http://127.0.0.1:8000/esm_sys_1020
      print('사용자 세션이 존재하지 않습니다. 로그인 화면으로 이동합니다.')

      absouluteRoot = request.build_absolute_uri("/")[:-1].strip("/")
      absouluteRoot = absouluteRoot + '/login'
      # print("absouluteRoot =>", absouluteRoot)      

      # 세션이 삭제되면 로그인 화면으로 전환
      if 'application/json' in request.headers['Accept']:
        return HttpResponse(status=403)
        # HttpResponse({'cd': '905', 'msg': '세션 끊김'})
      else:
        return HttpResponseRedirect('/')      
    else:
      # 화면 로딩시 화면에 대한 URI를 값을 받아 뒷자리 '/' 제거 후 URL만 추출
      absoluteURI = (request.build_absolute_uri())[:-1].strip("/")
      url = absoluteURI[absoluteURI.rfind('/'):]
      # print ("url =>", url)

      # 함수 및 변수 값 초기화
      orginalFucntionCall = None
      # args = ('searchBtn', 'addRowBtn', 'deleteRowBtn', 'saveBtn', 'copyBtn', 'batchBtn', 'printBtn', 'excelDownBtn', 'excelUpBtn')
      args = ()
      kwargs = {}
      
      # home 함수 확인
      if orginalFunction.__name__ == 'home':
        try:
          querySet = SysMenuV.objects.filter(Q(url=url) ,Q(use_yn='Y'))
          
          # 버튼에 대한 사용여부 확인
          for ca in querySet:
            kwargs['buttonShowHide'] = {
              'searchBtn'    : ca.search_yn,
              'addRowBtn'    : ca.add_row_yn,
              'delRowBtn'    : ca.del_row_yn,
              'saveBtn'      : ca.save_yn,
              'copyBtn'      : ca.copy_yn,
              'batchBtn'     : ca.batch_yn,              
              'printBtn'     : ca.print_yn,
              'excelDownBtn' : ca.excel_down_yn,
              'excelUpBtn'   : ca.excel_up_yn,
            }

        except Exception as e:
          kwargs['buttonShowHide'] = {
            'searchBtn'    : 'N',
            'addRowBtn'    : 'N',
            'delRowBtn'    : 'N',
            'saveBtn'      : 'N',
            'copyBtn'      : 'N',
            'batchBtn'     : 'N',
            'printBtn'     : 'N',
            'excelDownBtn' : 'N',
            'excelUpBtn'   : 'N',
          }

      # 화면별 공통메시지 초기화 변수
      kwargs['commParams'] = {'cd': 'S', 'msg': '', 'processCnt': {'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}} 
      
      # wrapperFunction 정상적으로 처리되면 orginalFunction에 값 할당
      orginalFucntionCall = orginalFunction(request, *args, **kwargs)

      # orginalFunction 수행
      return orginalFucntionCall
  return wrapperFunction