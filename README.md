# ESM
Electronic Service Management(전자복무관리)


안녕하세요.


전자복무관리 시스템 관리를 위한 산출물 목록 및 프로그램 소스를 GitHub를 통하여 관리합니다.

상세한 내용은 교육시간을 통하여 공유하도록 하겠습니다.

[참고] 프로젝트 참여 여러분 최선을 다하여 많은 성과를 내어 보도록 합시다.


# 파이썬 장고 설치 절차

1. 가상환경을 생성
 - C:\ESM\source>python -m venv esm_env(가상환경명)

2. 가상환경에 진입
 - C:\ESM\source>call esm_env/scripts/activate
 
   가상환경에서 빠져나오는 명령어 
 - C:\ESM\source>call esm_env/scripts/deactivate        

3. 가상환경 안에서 Django 설치
 - (esm_env) C:\ESM\source>pip install django

4. 프로젝트를 생성해줍니다.
 - (esm_env) C:\ESM\source>django-admin startproject esm(프로젝트명)

5. 환경이 제대로 설정 됐는지 확인하기 위해 서버를 실행
 - (esm_env) C:\ESM\source\esm>python manage.py runserver





감사합니다.
