



# ESM

Electronic Service Management(전자복무관리)

안녕하세요.

전자복무관리 시스템 관리를 위한 산출물 목록 및 프로그램 소스를 GitHub를 통하여 관리합니다.

상세한 내용은 교육시간을 통하여 공유하도록 하겠습니다.

[참고] 프로젝트 참여 여러분 최선을 다하여 많은 성과를 내어 보도록 합시다.



## 파이썬 장고 설치

* 가상환경 생성 

```python
C:\ESM\source>python -m venv esm_env(가상환경명)
```


* 가상환경 진입/종료

```bash
C:\ESM\source>call esm_env/scripts/activate
C:\ESM\source>call esm_env/scripts/deactivate
```

* [가상환경] 패키지 설치 확인

```python
pip list
```

* [가상환경] pip 업그레이드

```bash
c:\users\dims\appdata\local\programs\python\python36\python.exe -m pip install --upgrade pip
```

* [가상환경] Django 패키지 설치

```python
(esm_env) C:\ESM\source>pip install django
```

* [가상환경] 프로젝트 생성 : 

```python
(esm_env) C:\ESM\source>django-admin startproject esm
```

* [가상환경 ] 환경이 제대로 설정 됐는지 확인하기 위해 서버를 실행 

```python
(esm_env) C:\ESM\source\esm>python manage.py runserver 
로컬 도메인 : [https://127.0.0.1:8000](https://127.0.0.1:8000/)
```





## Git Pull / Push

* 로컬에서 변경된 내용을 Stage 추가

```bash
git add *
```

* Stage에 추가된 내용을 입력

```bash
git commit -m "GitHub 설명서-Command line Push 추가(p40)"
```

* Remote와 동기화 작업

```bash
git pull
```

* Stage에 Commit된 내용을 Push

```bash
git push origin master
```

