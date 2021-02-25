from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('search', views.doSearch),
    path('print', views.doPrint),
    path('save', views.doSave),
]
