# ESM
Electronic Service Management(전자복무관리)


안녕하세요.


전자복무관리 시스템 관리를 위한 산출물 목록 및 프로그램 소스를 GitHub를 통하여 관리합니다.

상세한 내용은 교육시간을 통하여 공유하도록 하겠습니다.

[참고] 프로젝트 참여 여러분 최선을 다하여 많은 성과를 내어 보도록 합시다.



# 파이썬 장고 설치 절차

1. 가상환경 생성
 - C:\ESM\source>python -m venv esm_env(가상환경명)

2. 가상환경 진입
 - C:\ESM\source>call esm_env/scripts/activate

   가상환경 종료
 - C:\ESM\source>call esm_env/scripts/deactivate        

3. [가상환경] 패키지 설치 확인
 - pip list

4. [가상환경] pip 업그레이드
 - c:\users\dims\appdata\local\programs\python\python36\python.exe -m pip install --upgrade pip

5. [가상환경] Django 패키지 설치
 - (esm_env) C:\ESM\source>pip install django

6. [가상환경] 프로젝트 생성 : esm
 - (esm_env) C:\ESM\source>django-admin startproject esm

7. [가상환경 ] 환경이 제대로 설정 됐는지 확인하기 위해 서버를 실행
 - (esm_env) C:\ESM\source\esm>python manage.py runserver
 - 로컬 도메인 : https://127.0.0.1:8000


감사합니다.
