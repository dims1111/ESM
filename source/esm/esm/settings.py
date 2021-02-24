# #################################################################################################
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : esm_app
# 프로그램 Name : 시스템 설정
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
# v1.1          2020-02-01       송영진       INSTALLED_APPS에 esm 개발 프로그램 자동등록
# #################################################################################################

# 경로 클래스 임포트
from pathlib import Path

# 로거 클래스 임포트
from esm.module_settings.logger import * # logger

# 시스템 클래스 임포트
import os
import re

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '10go6ztc)0!*vgeqz5_*rgk1@3t%k6azlpif-m^mo86ojomh*s'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# 전자식 복무관리 시스템
# 도메인 접속 권한 IP
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']

# 전자식 복무관리 시스템
# 브라우저 닫을 시 세션 삭제
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

# 전자식 복무관리 시스템
# 세션 타임아웃 시간 30분
SESSION_COOKIE_AGE = 600

# 전자식 복무관리 시스템
# 사용자의 요청이 존재하면 타임아웃 시간을 갱신
SESSION_SAVE_EVERY_REQUEST = True

# 전자식 복무관리 시스템
# INSTALLED_APPS에 esm 개발 프로그램 자동등록
def get_esm_app_list():
    esm_app_list = []
    path = os.path

    for file in os.listdir(BASE_DIR):
        file_path = path.join(BASE_DIR, file)
        if path.isdir(file_path) and re.match('^esm_', file):
            if (path.exists(path.join(file_path, 'apps.py'))):
                esm_app_list.append(file)
            else:
                filtered_obj = filter(lambda x: path.isdir(path.join(file_path, x)) and path.exists(path.join(file_path, x, 'apps.py')), os.listdir(file_path))
                mapped_obj = map(lambda x: file + '.' + x, filtered_obj)
                esm_app_list += list(mapped_obj)
    # print('추가된 apps List :', esm_app_list)
    return esm_app_list

# 전자식 복무관리 시스템
# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
] + get_esm_app_list()


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'esm.urls'

# 전자식 복무관리 시스템
# 템플릿 디렉토리 경로 경유
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'esm.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

# 전자식 복무관리 시스템
# 오라클 개발서버 접속정보
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.oracle',
        'NAME': 'vis1226',
        'USER': 'esm',
        'PASSWORD': 'esm',
        'HOST':'210.112.232.29',
        'PORT':'1531',
    },
}

# 전자식 복무관리 시스템
# local oracle server
# python manage.py inspectdb > esmdb.py
# 속도가 너무 느려서 로컬로 접속하여 모델 작성
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.oracle',
#         'NAME': 'vis1226',
#         'USER': 'esm',
#         'PASSWORD': 'esm',
#         'HOST': '210.112.232.29',
#         'PORT': '1531',
#     },
# }

# 전자식 복무관리 시스템
# 동적 쿼리 접속을 위한 오라클 DNS 정보
connectionDns = 'esm/esm@210.112.232.29:1531/vis1226'

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'

# 전자식 복무관리 시스템
# static 경로에 있는 파일을 public하게 오픈
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static')
]
X_FRAME_OPTIONS = 'SAMEORIGIN'
