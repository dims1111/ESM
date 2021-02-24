// 쿠키 가져오기
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// 로그인 페이지로 호출
function moveToLoginPage() {
  if (~top.location.pathname.indexOf('login')) {
    return;
  }

  if (top.opener) {
    top.opener.moveInfoPage(code);
    top.close();
  } else {
    top.location.replace("/login");
  }
}
