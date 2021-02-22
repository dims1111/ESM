/**
 * 입력값이 null에 해당하는 경우 모두를 한번에 체크한다.
 * @param {object} sValue object
 * @return {Boolean] sValue가 undefined, null, NaN, "", Array.length = 0인 경우 = true, 이외의 경우 = false
 */
this.gfn_isNull = function (sValue) {
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
 *
 * 로딩 모달 show
 */
function loadshow() {
  //gmessage('loading', '', 'primary');

  //$('body').append('<div id="kkkkggggkkkk" class="alert alert-dark" role="alert">zzzzzzzzzzzzzzzzzzzzzzzzzzzz</div>');
  $('#load_timer').text('00:00:00');
  $('.quriloading').show();
  if (intervalIds.length == 0) {

    var intervalId = setInterval(function () {
      var arr = $('#load_timer').text().split(':');
      var second = parseInt(arr[2]);
      var minute = parseInt(arr[1]);
      var hour = parseInt(arr[0]);
      second += 1;
      if (second == 60) {
        second = 0;
        minute += 1;
      }
      if (minute == 60) {
        minute = 0
        hour += 1;
      }
      hour = hour > 9 ? hour.toString() : '0' + hour.toString();
      minute = minute > 9 ? minute.toString() : '0' + minute.toString();
      second = second > 9 ? second.toString() : '0' + second.toString();
      var timeString = hour + ':' + minute + ':' + second;
      $('#load_timer').text(timeString);
    }, 1000)
    intervalIds.push(intervalId);
  }
  //$('#gl_loding').modal('show');
}

function loadhide() {
  //$('#gl_loding').modal('hide');
  //alert('z');
  for (var index = 0; index < intervalIds.length; index++) {
    clearInterval(intervalIds[index]);
  }
  intervalIds = [];

  $('#load_timer').text('00:00:00');
  $('.quriloading').hide();
}

/**
 *
 *
 * @param {*} _tstr 모달의 제목
 * @param {*} _msg 메세지
 * @param {*} arr 변수
 */
this.gfn_noticeshow = function (_tstr, _msg, arr) {
  if (!gfn_isNull(arr)) {
    var j = 1;
    for (var i = 0; i < arr.length; i++) {
      _msg = _msg.replace("{" + j + "}", arr[i]);
      j = j + 1;
    }
  }
  loadhide();
  $('#gl_notice .modal-title span').text(_tstr);
  $('#gl_notice .modal-body pre').text(_msg);
  $('#gl_notice').modal('show');
}

/**
 * 알림모달 hide
 *
 */
function noticehide() {
  $('#gl_notice').modal('hide');
}

/**
 *
 *
 * @param {*} _tstr 모달제목
 * @param {*} _msg 메세지
 * @returns
 */
function waringshow(_tstr, _msg) {
  //alert(getMsg(_msg,100));
  var orgMsg = _msg;
  //_tstr = '( sti' + _tstr + ' ) Exception Informations';
  // console.log("_tstr::", _tstr.trim() + "@@@@");
  // console.log("_msg::", _msg);
  // console.log(typeof(_tstr));
  if (typeof (_tstr) == 'number') {
    _tstr = toString(_tstr);
  }
  if (_tstr.trim() == '-99') { //session out 시 
    if (self == top) {
      location.href = "/";
    } else {
      parent.location.href = "/"
    }
    return;
  }
  //  개발기간 동안 주석처리
   _tstr = ld.errMsg;
   if (_msg.indexOf('ORA-') >= 0 || _msg.indexOf('TBR-') >= 0) {
     _msg = ld.errComment;
   }

  loadhide();
  var ttw = $('#gl_waring');
  if (ttw.length > 0) {
    $('#gl_waring .modal-title .hmsg').text(_tstr);
    //$('#gl_waring .modal-body pre').html(getMsg(_msg,100));
    //if (_msg.indexOf('req :') < 0) _msg = getMsgLen(_msg, 70)
    $('#gl_waring .modal-body pre').html(_msg);
    $('#gl_waring .modal-footer button').text(ld.close);
    $('#gl_waring').modal('show');
    $('#gl_waring #hiddenErrMsg').val(orgMsg);    
  }
  else {
    $('#gl_waring .modal-title .hmsg', parent.document).text(_tstr);
    //$('#gl_waring .modal-body pre', parent.document).text(_msg);
    $('#gl_waring .modal-body pre', parent.document).html(_msg);
    $('#gl_waring .modal-footer button', parent.document).text(ld.close);
    $('#gl_waring', parent.document).modal('show');
    $('#gl_waring #hiddenErrMsg', parent.document).val(orgMsg);
  }
}



/*
*getMsgLen : len 단위로 칸내려서 써준다
*/
function getMsgLen(_msg, _len) {
  if (_msg.length <= _len) return _msg;
  rStr = _msg.substring(0, _len);
  var cnt = parseInt(_msg.length / _len);
  for (var i = 1; i <= cnt; i++) {
    if (_len > _msg.substring(_len * i).length) {
      rStr += "<br>" + _msg.substring(_len * i);
    } else {
      rStr += "<br>" + _msg.substring(_len * i, _len * (i + 1));
    }
  }
  return rStr;
}

/**
 * 에러모달 숨기기
 *
 */
function waringhide() {
  var ttw = $('#gl_waring');
  if (ttw.length > 0) {
    $('#gl_waring').modal('hide');
  }
  else {
    $('#gl_waring', parent.document).modal('hide');
  }
}

// Ajax 파일 다운로드
jQuery.download = function (url, data, method) {
  // url과 data를 입력받음
  if (url && data) {
    // data 는  string 또는 array/object 를 파라미터로 받는다.
    data = typeof data == 'string' ? data : jQuery.param(data);
    // 파라미터를 form의  input으로 만든다.
    var inputs = '';
    jQuery.each(data.split('&'), function () {
      var pair = this.split('=');
      inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
    });
    // request를 보낸다.
    jQuery('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
      .appendTo('body').submit().remove();
  };
};

/**
 *
 *
 * @param {*} srvFilePath 서버 파일 경로
 * @param {*} downFileName 파일명
 */
this.gfn_file_download = function (srvFilePath, downFileName) {
  $.download('/file/filedownload', "path_to_file=" + srvFilePath + "&file_name=" + downFileName, 'post');
}



function rand() {
  return Math.round(Math.random() * 999999);
}

// case에 따라 '-' 자동으로 달아주기 (사용 여부는 미정)
function autoHypen(str, type) {
  str = String(str);

  if (type == 'phone') {
    str = str.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, "$1-$2-$3").replace("--", "-");
  }

  if (type == 'business') {
    str = str.replace(/[^0-9]/g, "").replace(/([0-9]{3})([0-9]{2})([0-9]{5})/, "$1-$2-$3").replace("--", "-");
  }

  return str;
}

// 문자열 내 모든 공백 제거
/**
 *
 *
 * @param {*} str 문자열
 * @returns 공백이 제거된 문자열 
 */
function removeBlank(str) {
  str = String(str);
  str = str.replace(/ /gi, "");
  return str;
}

// 문자열에서 숫자만 문자열로 반환
/**
 *
 *
 * @param {*} str 문자열
 * @returns 숫자만 남은 문자열
 */
function extractNum(str) {
  str = String(str);
  str = str.replace(/[^0-9]/g, "");
  return str;
}

/**
 * 금액에 , 삽입하기
 *
 * @param {*} str 금액 문자열
 * @returns ,가 삽입된 문자열
 */
function makeComma(str) {
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
 * 금액에 , 삽입하기
 *
 * @param {*} str 금액 문자열
 * @returns ,가 삽입된 문자열
 */
function makeComma2(str) {
  return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 *
 *
 * @param {*} str 문자열
 * @returns yyyy-mm 형태의 문자열 
 */
function makeYM(str) {
  str = String(str);
  str = str.substring(0, 6);
  str = str.replace(/(\d{4})+(\d{2})/, '$1-$2');
  if (validateYM(str) === false) {
    return ''
  }
  return str;

}

/**
 *
 *
 * @param {*} str 문자열
 * @returns yyyy-mm-dd 형태의 문자열
 */
function makeYMD(str) {
  str = makePureStr(String(str));
  str = str.substring(0, 8);
  str = str.replace(/(\d{4})+(\d{2})+(\d{2})/, '$1-$2-$3');

  if (validateYMD(str) === false) {
    return ''
  }
  return str;
}

function makePureStr(str) {
  str = String(str);
  return str.replace(/[^0-9 ]/g, "");
}



/**
 *
 * yyyy-mm-dd 형태로 표현가능한 형태인지 확인
 * @param {*} str 문자열 
 * @returns true 변환가능 false 변환불가능
 */
function validateYMD(str) {
  var date = new Date(str);
  var year, month, day;
  year = date.getFullYear().toString();
  month = date.getMonth() + 1;
  day = date.getDate();
  month = month > 9 ? month.toString() : '0' + month.toString();
  day = day > 9 ? day.toString() : '0' + day.toString();

  var str = makePureStr(str);
  var tempStr = year + month + day;

  if (str === tempStr) {
    return true;
  }
  return false;
}

/**
 *
 * yyyy-mm 으로 표현가능한 문자열인지 확인하는 함수
 * @param {*} str 문자열
 * @returns true 변환가능 false 변환불가능
 */
function validateYM(str) {
  var date = new Date(str + '-01');
  var year, month;

  year = date.getFullYear().toString();
  month = date.getMonth() + 1;
  month = month > 9 ? month.toString() : '0' + month.toString();

  var str = makePureStr(str);
  var tempStr2 = year + month;

  if (str === tempStr2) {
    return true;
  }
  return false;
}


/**
 *
 * 장학금의 uid를 가져오는 함수 
 * bas_1020 화면에 보이는 장학금의 UID
 * @param {*} svcId 콜백의 서비스 id
 * @param {*} magic_const 장학금의 매직상수
 * @param {*} callBack 콜백
 * @param {*} isSync 동기 비동기 여부 
 */
this.gfn_getBasUid = function (svcId, magic_const, callBack, isSync) {
  if (gfn_isNull(isSync)) isSync = false
  var jsonData = {
    magic_const: magic_const
  }
  if (isSync) {
    gfn_ajaxTransaction(svcId, '/comm/get_bas_scholarship_code_uid', '', svcId + '=output', jsonData, callBack, '', false, false);
  }
  else {
    gfn_ajaxTransaction(svcId, '/comm/get_bas_scholarship_code_uid', '', svcId + '=output', jsonData, callBack, '', false);
  }
}


/**
 * 공통코드의 디테일 코드중 1개의 uid 를 가져오는 함수
 *
 * @param {*} svcId 콜백의 서비스 아이디
 * @param {*} master_const 공통코드 마스터의 매직상수
 * @param {*} detail_const 공통코드 디테일의 매직상수
 * @param {*} callBack 콜백함수명
 * @param {*} type_code db상의 type_code 분기
 * @param {*} isSync 동기 비동기 여부
 */
this.gfn_getSingleUid = function (svcId, master_const, detail_const, callBack, type_code, isSync) {
  if (gfn_isNull(isSync)) isSync = false
  if (gfn_isNull(type_code)) type_code = 'code_detail'
  var jsonData = {
    'p_type_code': type_code
    , 'p_master_magic_const': master_const
    , 'p_detail_magic_const': detail_const
  }
  if (isSync) {
    gfn_ajaxTransaction(svcId, '/comm/get_single_uid', '', svcId + '=output', jsonData, callBack, '', false, false);
  }
  else {
    gfn_ajaxTransaction(svcId, '/comm/get_single_uid', '', svcId + '=output', jsonData, callBack, '', false);
  }
}

/**
 *
 *
 * @returns 
 */
this.gfn_getUUID = function () {
  //svcID, callUrl, inDatasets, outDatasets, argument, callbackFunc, showProgress, bAsync
  gfn_ajaxTransaction('get_uuid', "/comm/get_uuid", "", "rdata=output", null, null, null, false);
  var uuid = dataset.rdata[0].uuid;
  // console.log("uuid..", uuid);
  return uuid;
}

/**
 * 해당 값이 번호로 표현된 값인지 확인
 *
 * @param {*} gubun 전화번호 구분 (핸드폰 or 유선)
 * @param {*} value 번호 값
 * @returns true: 적합한 값 false: 비적합
 */
this.gfn_isPhone = function (gubun, value) {
  var expression;
  var returnValue = false;

  if (gubun == "TEL_NO") {
    expression = new RegExp(/^0(2{1}|[0-9]{2,3})[0-9]{3,4}[0-9]{4}$/);
  }
  else if (gubun == "HP_NO") {
    expression = new RegExp(/^(010|011|016|017|018|019)[0-9]{3,4}[0-9]{4}$/);
  }
  else {
    alert("isPhone함수의 첫번째 인자는 HP_NO 또는 TEL_NO 이어야합니다.");
    return false;
  }

  if (!this.gfn_isNull(value)) {
    value = value.replace(/-/g, "");
    returnValue = expression.test(value);
  }
  else {
    returnValue = false;
  }

  return returnValue;
}