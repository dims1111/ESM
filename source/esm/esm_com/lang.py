# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_com
# 프로그램 Name : 시스템 공통 - 언어 코드 및 오류 메시지를 위한 함수 또는 클래스
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# #################################################################################################


# 언어코드 및 메시지 클래스
class langMsg:
  langCd = 'kor'
  # msgParam = {'errNum': '-1', 'langCd' : langCd}
  msgParam = {'cd': 'S', 'msg': '', 'processCnt': {'S': 0, 'I': 0, 'U': 0, 'D': 0, 'B': 0}}

  # 데이터가 존재하지 않는 예외 처리 클래스
  class noDataFound(Exception):
    pass
  
  # 데이터 비교시 불일치 예외 처리 클래스
  class noDataMatch(Exception):
    pass

  class userException(Exception):
    pass

  # 파일 형식에서 ORM형식으로 변경 예정  
  def errMsg():
    errNum = langMsg.msgParam.get('errNum')
    langCd = langMsg.langCd
    errDescr = ''

    # #############################################################################################
    # 오류 메시지 : ERR-1000 ~ ERR-9999
    # #############################################################################################    
    if errNum == 'ERR-1000':
      if langCd == 'kor':
        errDescr = '사용자 계정 또는 이메일 주소가 존재하지 않습니다.'
      elif langCd == 'eng':
        errDescr = 'User account or email address does not exist.'

    elif errNum == 'ERR-1010':
      if langCd == 'kor':
        errDescr = '비밀번호가 일치하지 않습니다.'
      elif langCd == 'eng':
        errDescr = 'Passwords do not match.'

    elif errNum == 'ERR-1020':
      if langCd == 'kor':
        errDescr = '조회 조건에 일치하는 데이터가 존재하지 않습니다.'
      elif langCd == 'eng':
        errDescr = 'No data found.'

    # #############################################################################################
    # 필수 항목에 대한 오류 메시지 : REQ-1000 ~ REQ-9999
    # #############################################################################################
    elif errNum == 'REQ-1000':
      if langCd == 'kor':
        errDescr = '사용자 계정은 필수 항목입니다.'
      elif langCd == 'eng':
        errDescr = 'User accounts are required.'
    
    elif errNum == 'REQ-1010':
      if langCd == 'kor':
        errDescr = '사용자 계정은 필수 항목입니다.'
      elif langCd == 'eng':
        errDescr = 'Password is required.'
    
    return errDescr      