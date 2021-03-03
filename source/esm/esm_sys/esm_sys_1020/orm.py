# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_sys_1020
# 프로그램 Name : 메뉴등록
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# #################################################################################################
# 데이터베이스 트랜잭션 관리 임포트
from django.db import transaction

# 시간, json 클래스 임포트
import datetime, json

# resultMsg 클래스 임포트
from esm_com import util

# 로그인 모델 내 SysMenu 클래스 임포트
from . models import SysMenu


# #################################################################################################
# orm 사용할 조건 목록 및 예시
# #################################################################################################
#
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
#
# #################################################################################################

now = datetime.datetime.now()

# 트랜잭션 관리 방법 - 1. 세이브 포인트 방식, 2.데코레이트 방식
# 1. 세이브 포이트 방식 : 사용자 여러개의 데이터를 저장 처리 시 로직에 의해서 커밋 또는 롤백 처리 시 사용
# 2. 데코레이트 방식 : 해당 함수 내 오류가 없으면 자동 커밋, 오류가 존재하면 롤백 처리 (함수 위에 @transaction.atomic 작성)
# 신규 데이터 처리
@transaction.atomic
def doInsert(dataList, commParam):
  try:
    i = 0
    bulkDataLists = []
    userId = commParam['userInfo']['userId']

    # 신규 데이터 확인
    for ca in dataList:
      # 신규 클래스 생성
      newData = SysMenu()

      # 신규 클래스 항목별 값 할당
      newData.menu_uid          = None
      newData.menu_cd           = ca.get('menu_cd')
      newData.menu_name_ko      = ca.get('menu_name_ko')
      newData.menu_name_en      = ca.get('menu_name_en')
      newData.url               = ca.get('url')
      newData.parent_menu_cd    = ca.get('parent_menu_cd')
      newData.icons             = ca.get('icons')
      newData.sort_order        = ca.get('sort_order')
      newData.use_yn            = util.defaultYn(ca.get('use_yn'), 'N')
      newData.search_yn         = util.defaultYn(ca.get('search_yn'), 'N')
      newData.add_row_yn        = util.defaultYn(ca.get('add_row_yn'), 'N')
      newData.del_row_yn        = util.defaultYn(ca.get('del_row_yn'), 'N')
      newData.save_yn           = util.defaultYn(ca.get('save_yn'), 'N')
      newData.copy_yn           = util.defaultYn(ca.get('copy_yn'), 'N')
      newData.batch_yn          = util.defaultYn(ca.get('batch_yn'), 'N')
      newData.print_yn          = util.defaultYn(ca.get('print_yn'), 'N')
      newData.excel_down_yn     = util.defaultYn(ca.get('excel_down_yn'), 'N')
      newData.excel_up_yn       = util.defaultYn(ca.get('excel_down_yn'), 'N')
      newData.remark            = ca.get('remark')
      newData.create_date_time  = now
      newData.create_by         = userId
      newData.update_date_time  = now
      newData.update_by         = userId

      # 리스트에 신규 클래스 값 추가
      bulkDataLists.append(newData)
      i += 1

      print("newData =>", newData)

    # 대량 데이터 일괄 저장
    SysMenu.objects.bulk_create(bulkDataLists)

    # 데이터 처리 후 건수 표기
    commParam['processCnt']['I'] = i

  except Exception as e:
    commParam = {'cd' : 'E', 'msg' : e.args[0], 'processCnt': {'I': 0}}
  return commParam


# 수정 처리
@transaction.atomic
def doUpdate(dataList, commParam):
  try:
    i = 0    
    userId = commParam['userInfo']['userId']

    # 수정 데이터 확인
    for ca in dataList:
      print("menu_uid =>", ca.get('menu_uid'), "icons =>", ca.get('icons'))
      getData = SysMenu.objects.filter(pk=ca.get('menu_uid'))
      
      # 키를 기준으로 조회된 데이터 셋(getData)에 수정된 값(dataList) 할당
      for updateData in getData:
        updateData.menu_cd          = ca.get('menu_cd')
        updateData.menu_name_ko     = ca.get('menu_name_ko')
        updateData.menu_name_en     = ca.get('menu_name_en')
        updateData.url              = ca.get('url')
        updateData.parent_menu_cd   = ca.get('parent_menu_cd')
        updateData.icons            = ca.get('icons')
        updateData.sort_order       = ca.get('sort_order')
        updateData.use_yn           = util.defaultYn(ca.get('use_yn'), 'N')
        updateData.search_yn        = util.defaultYn(ca.get('search_yn'), 'N')
        updateData.add_row_yn       = util.defaultYn(ca.get('add_row_yn'), 'N')
        updateData.del_row_yn       = util.defaultYn(ca.get('del_row_yn'), 'N')
        updateData.save_yn          = util.defaultYn(ca.get('save_yn'), 'N')
        updateData.copy_yn          = util.defaultYn(ca.get('copy_yn'), 'N')
        updateData.batch_yn         = util.defaultYn(ca.get('batch_yn'), 'N')
        updateData.print_yn         = util.defaultYn(ca.get('print_yn'), 'N')
        updateData.excel_down_yn    = util.defaultYn(ca.get('excel_down_yn'), 'N')
        updateData.excel_up_yn      = util.defaultYn(ca.get('excel_up_yn'), 'N')
        updateData.remark           = ca.get('remark')
        updateData.update_date_time = now
        updateData.update_by        = userId        
        i += 1
      
      for ca in getData:
        # 대량의 데이터 일괄 수정
        SysMenu.objects.bulk_update(getData, ['menu_cd'
                                              ,'menu_name_ko'
                                              ,'menu_name_en'
                                              ,'url'
                                              ,'parent_menu_cd'
                                              ,'icons'
                                              ,'sort_order'
                                              ,'use_yn'
                                              ,'search_yn'
                                              ,'add_row_yn'
                                              ,'del_row_yn'
                                              ,'save_yn'
                                              ,'copy_yn'
                                              ,'batch_yn'
                                              ,'print_yn'
                                              ,'excel_down_yn'
                                              ,'excel_up_yn'
                                              ,'remark'
                                            ])
    # 데이터 처리 후 건수 표기
    commParam['processCnt']['U'] = i
    
  except Exception as e:
    print("@@@@@ 수정 오류 @@@@@ ")
    commParam = {'cd' : 'E', 'msg' : e.args[0], 'processCnt': {'U': 0}}
  return commParam


# 삭제 처리
@transaction.atomic
def doDelete(dataList, commParam):
  try:
    i = 0

    # 삭제 데이터 확인
    for ca in dataList:
      deleteData = SysMenu.objects.filter(pk=ca.get('menu_uid'))

      # 자료가 존재하면 삭제
      if deleteData.exists():
        deleteData.delete()
        i += 1

    # 데이터 처리 후 건수 표기
    commParam['processCnt']['D'] = i

  except Exception as e:
    print("@@@@@ 삭제 오류 @@@@@ ")
    commParam = {'cd' : 'E', 'msg' : e.args[0], 'processCnt': {'D': 0}}
  return commParam