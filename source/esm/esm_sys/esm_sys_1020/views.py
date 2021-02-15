from django.shortcuts import render

# Create your views here.

def home(request):
  return render(request, 'esm_sys_1020.html')