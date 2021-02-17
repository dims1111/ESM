from django.shortcuts import render

# query 문장 매핑을 위한 클래스 임포트
from .query import sql

# query 실행을 위한 클래스 임포트
from static_template import views as stViews

# 로그인 모델 내 SysUser 클래스 임포트
from . models import SysMenu

# Create your views here.
# 메뉴 클릭 후 첫 화면 오픈
def home(request):
  return render(request, 'esm_sys_1020.html')

# 조회 버튼을 클릭
def search(request):
  return render(request, 'esm_sys_1020.html')

# 저장 버튼을 클릭
def save(request):
  return render(request, 'esm_sys_1020.html')  

# 행 추가 버튼을 클릭
def gridRowAdd(request):
  pass

# 행 삭제 버튼을 클릭
def gridRowMinus(request):
  pass

# 엑셀업로드 버튼을 클릭
def excelDown(request):
  pass  

# 엑셀다운로드 버튼을 클릭
def excelUp(request):
  pass
