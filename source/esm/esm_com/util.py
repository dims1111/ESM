from django.shortcuts import redirect

# #################################################################################################
# 일반적인 함수 및 클래스 선언
# #################################################################################################

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


# 검색 데코레이트
def sessionDecorator(orginalFunction):
    def wrapperFunction(request, *args, **kwargs):
        # 사용자 세션 정보 오류일 경우 로그인 화면으로 이동
        if request.session.get('user_id') is None:
            # 테스트 : http://127.0.0.1:8000/esm_sys_1020
            print('사용자 세션이 존재하지 않습니다. 로그인 화면으로 이동합니다.')
            return redirect('/')
        else:
            pass
       
        return orginalFunction(request, *args, **kwargs)
    return wrapperFunction