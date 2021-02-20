
# 언어코드 및 메시지 클래스
class langMag:
  langCd = 'kor'
  msgParam = {'errNum': -1, 'langCd' : langCd}
  title = {'main' : '', 'sub1': '', 'sub2' : '', 'sub3' : ''}

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
    errNum = langMag.msgParam.get('errNum')
    langCd = langMag.msgParam.get('langCd')

    if errNum == 1000:
      if langCd == 'kor':
        errDescr = '사용자 계정 또는 이메일 주소가 존재하지 않습니다.'
      elif langCd == 'eng':
        errDescr = 'User account or email address does not exist.'

    elif errNum == 1010:
      if langCd == 'kor':
        errDescr = '비밀번호가 일치하지 않습니다.'
      elif langCd == 'eng':
        errDescr = 'Passwords do not match.'

    elif errNum == 1020:
      if langCd == 'kor':
        errDescr = '조회 조건에 일치하는 데이터가 존재하지 않습니다.'
      elif langCd == 'eng':
        errDescr = 'No data found.'

    elif errNum == 1030:
      if langCd == 'kor':
        errDescr = '대기중'
      elif langCd == 'eng':
        errDescr = 'pendding'
    
    return errDescr
  






      