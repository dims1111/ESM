from django.http.response import HttpResponse
from django.shortcuts import redirect, render

# query 문장 매핑을 위한 클래스 임포트
from .query import sql


# 로그인 모델 내 SysUser 클래스 임포트
from . models import SysMenu

# Create your views here.
# 메뉴 클릭 후 첫 화면 오픈
def home(request):  
  return render(request, 'esm_sys_1020.html')

# 조회 버튼을 클릭
def search(request):
  homeUrl = request.text
  print(homeUrl)
  return render(request, 'esm_sys_1020.html')

# 초기화 버튼을 클릭
def clear(request):
  return render(request, 'esm_sys_1020.html')

# 출력 버튼을 클릭
def print(request):
  return render(request, 'esm_sys_1020.html')

# 저장 버튼을 클릭
def save(request):
  return render(request, 'esm_sys_1020.html')

# 행 추가 버튼을 클릭
def gridRowAdd(request):
  return render(request, 'esm_sys_1020.html')

# 행 삭제 버튼을 클릭
def gridRowDelete(request):
  return render(request, 'esm_sys_1020.html')

# 엑셀업로드 버튼을 클릭
def excelDown(request):
  return render(request, 'esm_sys_1020.html')  

# 엑셀다운로드 버튼을 클릭
def excelUp(request):
  return render(request, 'esm_sys_1020.html')
