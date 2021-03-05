var intervalIds = {};

/* ************************************************************************************************
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : comUtil.js
# 프로그램 Name : 자바스크립트 공통 함수
# 참고          : 자바스크립트 셀프 테스트 사이트 : http://jsbin.com/?js,console,output
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       강정기       최초작성
************************************************************************************************ */

/** 
 * 함 수 명 : gfnIsNull
 * 설    명 : 매개변수 값이 널인지 체크
 * 리턴형식 : Boolean → undefined, null, NaN, "", Array.length = 0인 경우 = true, 그외의 경우 = false
 * 매개변수 
 * @param {*} sValue 오브젝트 
**/
this.gfnIsNull = function (sValue) {
  if (new String(sValue).valueOf() == "undefined") {
    return true;
  }
  if (sValue == null) {
    return true;
  }
  if ((sValue == "NaN") && (new String(sValue.length).valueOf() == "undefined")) {
    return true;
  }
  if (sValue.length == 0) {
    return true;
  }
  if (sValue.toString() == "") {
    return true;
  }
  if (new String(sValue).trim(' ') == "") {
    return true;
  }
  return false;
}


/**
 * 함 수 명 : gfnAutoHypen
 * 설    명 : 형식이 존재하는 데이터에 대한 포멧을 지원하는 함수
 * 리턴형식 : 문자
 * 매개변수
 * @param {*} str   문자
 * @param {*} type  phone: 전화번호, business: 사업자등록번호
 **/
function gfnAutoHypen(str, type) {
  str = String(str);

  if (type == 'phone') {
    str = str.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, "$1-$2-$3").replace("--", "-");
  }
  if (type == 'business') {
    str = str.replace(/[^0-9]/g, "").replace(/([0-9]{3})([0-9]{2})([0-9]{5})/, "$1-$2-$3").replace("--", "-");
  }
  return str;
}


/**
 * 함 수 명 : gfnRemoveBlank
 * 설    명 : 문자열의 공백을 제거하는 함수
 * 리턴형식 : 문자
 * 매개변수
 * @param {*} str 문자
**/
function gfnRemoveBlank(str) {
  str = String(str);
  str = str.replace(/ /gi, "");
  return str;
}


/**
 * 함 수 명 : gfnExtractNum
 * 설    명 : 문자열에서 숫자만 추출하는 함수
 * 리턴형식 : 문자
 * 매개변수
 * @param {*} str 문자
**/
function gfnExtractNum(str) {
  str = String(str);
  str = str.replace(/[^0-9]/g, "");
  return result;
}


/**
 * 함 수 명 : gfnMakeComma
 * 설    명 : 천단위 콤마를 표기하는 함수
 * 리턴형식 : 문자
 * 매개변수
 * @param {*} str 문자
**/
function gfnMakeComma(str) {
  if (str == null || str == '' || str == undefined) {
    return '0';
  }

  str = String(str);
  str = str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  if (str.length < 1) {
    str = '0';
  }
  return str;
}


/**
 * 함 수 명 : gfnMakeYM
 * 설    명 : YYYY-MM 형식으로 문자열 변환 함수
 * 리턴형식 : 문자
 * 매개변수
 * @param {*} str 문자
**/
function gfnMakeYM(str) {
  str = String(str);
  str = str.substring(0, 6);
  str = str.replace(/(\d{4})+(\d{2})/, '$1-$2');
  if (gfnValidateYM(str) === false) {
    return ''
  }
  return str;

}


/**
 * 함 수 명 : gfnMakeYMD
 * 설    명 : YYYY-MM-DD 형식으로 문자열 변환 함수
 * 리턴형식 : 문자
 * 매개변수
 * @param {*} str 문자
**/
function gfnMakeYMD(str) {
  str = gfnExtractNum(String(str));
  str = str.substring(0, 8);
  str = str.replace(/(\d{4})+(\d{2})+(\d{2})/, '$1-$2-$3');

  if (gfngfnValidateYMD(str) === false) {
    return ''
  }
  return str;
}


/**
 * 함 수 명 : gfngfnValidateYMD
 * 설    명 : YYYY-MM-DD 날짜형식으로 일치하는지 검증하는 함수
 * 리턴형식 : 문자
 * 매개변수
 * @param {*} Boolean true: 정상, false: 오류
**/
function gfngfnValidateYMD(str) {
  var date = new Date(str);
  var year, month, day;
  year = date.getFullYear().toString();
  month = date.getMonth() + 1;
  day = date.getDate();
  month = month > 9 ? month.toString() : '0' + month.toString();
  day = day > 9 ? day.toString() : '0' + day.toString();

  var str = gfnExtractNum(str);
  var tempStr = year + month + day;

  if (str === tempStr) {
    return true;
  }
  return false;
}


/**
 * 함 수 명 : gfnValidateYM
 * 설    명 : YYYY-MM 형식에 일치하는지 검증하는 함수
 * 리턴형식 : 문자
 * 매개변수 
 * @param {*} Boolean true: 정상, false: 오류
**/
function gfnValidateYM(str) {
  var date = new Date(str + '-01');
  var year, month;

  year = date.getFullYear().toString();
  month = date.getMonth() + 1;
  month = month > 9 ? month.toString() : '0' + month.toString();

  var str = gfnExtractNum(str);
  var tempStr2 = year + month;

  if (str === tempStr2) {
    return true;
  }
  return false;
}


/**
 * 함 수 명 : gfnValidatePhone
 * 설    명 : 해당 값이 전화번호로 표기를 검증하는 함수
 * 리턴형식 : Boolean → true: 정상, false: 오류
 * 매개변수
 * @param {*} gubun 전화유형
 * @param {*} value 전화번호       
**/
this.gfnValidatePhone = function (gubun, value) {
  var expression;
  var returnValue = false;

  if (gubun == "TEL_NO") {
    expression = new RegExp(/^0(2{1}|[0-9]{2,3})[0-9]{3,4}[0-9]{4}$/);
  }
  else if (gubun == "HP_NO") {
    expression = new RegExp(/^(010|011|016|017|018|019)[0-9]{3,4}[0-9]{4}$/);
  }
  else {
    alert("전화번호 형식에 일치하지 않습니다.");
    return false;
  }

  if (!this.gfnIsNull(value)) {
    value = value.replace(/-/g, "");
    returnValue = expression.test(value);
  }
  else {
    returnValue = false;
  }

  return returnValue;
}


/**
 * 함 수 명 : gfnLoadshow
 * 설    명 : 데이터 조회시 로딩 시간을 표기
 * 리턴형식 : N/A
 * 매개변수 : N/A
**/
function gfnLoadshow(grid) {
  var $target = grid ? grid : $('body');
  var $div = $('<div />', {
    class: "col-xs-11 col-sm-1 alert alert-primary animated bounceInDown loadingbar",
    style: "width:150px; margin: 0px auto; transition:0.5s ease-in-out; left: 50%; top: 50%; transform: translate(-50%, -50%); display: inline-block; position: absolute; z-index: 99999; animation-iteration-count: 1; max-width: none !important;",
    role: 'alert',
    'data-notify': "container",
    'data-notify-position': "top-center",
  });

  var $spinner = $('<div />', {
    class:"spinner-border ml-auto close", 
    role:"status", 
    'aria-hidden' :"true"
  })

  var $title = $('<div />', {
    'data-notify': 'title',
    text: 'loading',
    style: 'font-weight: 700;'
  })

  var $message = $('<span />', {
    id: 'load_timer',
    'data-notify': 'message',
    text: ' 00:00:00'
  })

  $div
    .append($spinner)
    .append($title)
    .append($message);

  $target.append($div);

  var intervalId = setInterval(function () {
    var arr = $('#load_timer').text().split(':');
    var hour = parseInt(arr[0]); // 시
    var minute = parseInt(arr[1]); // 분
    var second = parseInt(arr[2]); // 초

    second += 1;
    if (second == 60) {
      second = 0;
      minute += 1;
    }
    if (minute == 60) {
      minute = 0;
      hour += 1;
    }
    hour = ('0' + hour).substr(-2);
    minute = ('0' + minute).substr(-2);
    second = ('0' + second).substr(-2);
    $('#load_timer').text(hour + ':' + minute + ':' + second);
  }, 1000);

  intervalIds[$target.attr('id') || 'body'] = intervalId;
}


/**
 * 함 수 명 : gfnLoadhide
 * 설    명 : 데이터 조회 후 로딩 숨기기
 * 리턴형식 : N/A
 * 매개변수 : N/A
**/
function gfnLoadhide(grid) {
  var $target = grid ? grid : $('body')
  var targetId = grid ? grid.attr('id') : 'body';

  clearInterval(intervalIds[targetId]);
  delete intervalIds[targetId];

  $target.find('.loadingbar').remove();
}


/**
 * 함 수 명 : gfnNoticeModalShow
 * 설    명 : 알림 모달 오픈
 * 리턴형식 : N/A
 * 매개변수  
 * @param {*} _msg  모달 컨텐츠 메세지 
**/
this.gfnNoticeModalShow = function (errMessage) {  
  // gfnLoadhide();
  // 오류 또는 정상이지만 메시지가 존재하면 파업 메시지 출력
  $("#errorModal #errorModalContents").html(errMessage);
  $("#errorModal").modal("show");

  // $('#gl_notice .modal-title span').text(_tstr);
  // $('#gl_notice .modal-body pre').text(_msg);
  // $('#gl_notice').modal('show');
}


/**
 * 함 수 명 : gfnNoticeModalShow
 * 설    명 : 알림 모달 숨기기
 * 리턴형식 : N/A
 * 매개변수 : N/A
**/
function gfnNoticeModalHide() {
  $('#gl_notice').modal('hide');
}


/**
 * 함 수 명 : gfnErrorModalShow
 * 설    명 : 오류 모달 오픈
 * 리턴형식 : N/A
 * 매개변수
 * @param {*} _tstr 모달 제목
 * @param {*} _msg  모달 컨텐츠 메세지
**/
function gfnErrorModalShow(_tstr, _msg) {
  var orgMsg = _msg;

  if (typeof (_tstr) == 'number') {
    _tstr = toString(_tstr);
  }
  if (_tstr.trim() == '-99') {
    if (self == top) {
      location.href = "/";
    } else {
      parent.location.href = "/"
    }
    return;
  }

  // 개발기간 동안 주석처리
  _tstr = ld.errMsg;
  if (_msg.indexOf('ORA-') >= 0 || _msg.indexOf('TBR-') >= 0) {
    _msg = ld.errComment;
  }

  gfnLoadhide();
  var ttw = $('#gl_waring');
  if (ttw.length > 0) {
    $('#gl_waring .modal-title .hmsg').text(_tstr);  
    $('#gl_waring .modal-body pre').html(_msg);
    $('#gl_waring .modal-footer button').text(ld.close);
    $('#gl_waring').modal('show');
    $('#gl_waring #hiddenErrMsg').val(orgMsg);    
  }
  else {
    $('#gl_waring .modal-title .hmsg', parent.document).text(_tstr);
    $('#gl_waring .modal-body pre', parent.document).html(_msg);
    $('#gl_waring .modal-footer button', parent.document).text(ld.close);
    $('#gl_waring', parent.document).modal('show');
    $('#gl_waring #hiddenErrMsg', parent.document).val(orgMsg);
  }
}


/**
 * 함 수 명 : gfnErrorModalHide
 * 설    명 : 오류 모달 숨기기
 * 리턴형식 : N/A
 * 매개변수 : N/A
**/
function gfnErrorModalHide() {
  var ttw = $('#gl_waring');
  if (ttw.length > 0) {
    $('#gl_waring').modal('hide');
  }
  else {
    $('#gl_waring', parent.document).modal('hide');
  }
}


/**
 * 함 수 명 : jQuery.download
 * 설    명 : Ajax 파일 다운로드
 * 리턴형식 : N/A
 * 매개변수
 * @param {*} url 다운받을 URL
 * @param {*} data  string, arrary, object
 * @param {*} method  post 방식으로 폼에 전달
**/
jQuery.download = function (url, data, method) {
  // url과 data를 입력받음
  if (url && data) {
    // data는 string 또는 array/object를 파라미터로 받음
    data = typeof data == 'string' ? data : jQuery.param(data);
    // 파라미터를 form의  input으로 만듦
    var inputs = '';
    jQuery.each(data.split('&'), function () {
      var pair = this.split('=');
      inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
    });
    // request를 보냄
    jQuery('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
      .appendTo('body').submit().remove();
  };
};


/**
 * 함 수 명 : gfnFileDownload
 * 설    명 : 서버의 파일을 다운로드
 * 리턴형식 : N/A
 * 매개변수 :
 * @param {*} srvFilePath 서버 파일 경로
 * @param {*} downFileName  파일명
**/
this.gfnFileDownload = function (srvFilePath, downFileName) {
  $.download('/file/filedownload', "path_to_file=" + srvFilePath + "&file_name=" + downFileName, 'post');
}


/**
 * 함 수 명 : rand
 * 설    명 : 레덤 값을 찾는 함수
 * 리턴형식 : 정수
 * 매개변수 : N/A
**/
function rand() {
  return Math.round(Math.random() * 999999);
}
