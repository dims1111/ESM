"""
Django settings for esm project.

Generated by 'django-admin startproject' using Django 3.1.6.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '10go6ztc)0!*vgeqz5_*rgk1@3t%k6azlpif-m^mo86ojomh*s'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# 도메이 접속 권한 IP
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']

# 브라우저 닫을 시 세션 삭제
SESSION_EXPIRE_AT_BROWSER_CLOSE = True


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 전자식 복무관리 시스템
    # 정적 템플릿
    'static_template',

    # 로그인 / 로그아웃 / 홈
    'esm_app',
    # 공통 템플릿, 함수
    'esm_com',
    # 시스템관리
    'esm_sys.esm_sys_1000',     # 사용자등록
    'esm_sys.esm_sys_1010',     # 메뉴등록
    'esm_sys.esm_sys_1020',     # 언어코드등록
]

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

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'esm/templates')],
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
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.oracle',
#         'NAME': 'vis1226',
#         'USER': 'esm',
#         'PASSWORD': 'esm',
#         'HOST':'210.112.232.29',
#         'PORT':'1531',
#     },
# }

# local oracle server
# python manage.py inspectdb > esmdb.py
# 속도가 너무 느려서 로컬로 접속하여 모델 작성
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.oracle',
        'NAME': 'esmprod',
        'USER': 'esm',
        'PASSWORD': 'esm',
        'HOST':'localhost',
        'PORT':'1522',
    },
}

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