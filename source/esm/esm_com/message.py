# 언어 코드
class UserLangCd:
  langCd = 'kor'

# 예외 처리
# 파일 형식에서 ORM형식으로 변경 예정
def esmErrMsg(errNum, langCd):
  returnValue = ''

  if errNum == 1000:
    if langCd == 'kor':
      returnValue = '사용자 계정 또는 이메일 주소가 존재하지 않습니다.'
    elif langCd == 'eng':
      returnValue = 'User account or email address does not exist.'

  elif errNum == 1010:
    if langCd == 'kor':
      returnValue = '비밀번호가 일치하지 않습니다.'
    elif langCd == 'eng':
      returnValue = 'Passwords do not match.'

  elif errNum == 1020:
    if langCd == 'kor':
      returnValue = '조회된 데이터가 존재하지 않습니다.'
    elif langCd == 'eng':
      returnValue = 'No data found.'
  
  return returnValue


      