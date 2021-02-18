from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def test(request):
    return render(request, "esm_sys/esm_sys_1000.html")