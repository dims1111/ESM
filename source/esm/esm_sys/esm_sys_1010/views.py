from django.shortcuts import render

# Create your views here.

def home(request):
  return render(request, 'esm_sys/esm_sys_1010.html')