var dataset = {};

var checkChangeObj = function () {
  this.grdArr = [];
  this.getGrdArr = function () {
    if (this.grdArr.length === 0) {
      return ["grd", "grd1", "grd2", "grd3", "grd4", "grd5"];
    } else {
      return this.grdArr;
    }
  };
  this.setGrdArr = function (arr) {
    this.grdArr = arr;
  };
};

var CHK_OBJ = new checkChangeObj();

function setGrdArr(arr) {
  CHK_OBJ.setGrdArr(arr);
}

function getGrdArr() {
  return CHK_OBJ.getGrdArr();
}
// icon을 사용하고자 하는 태그에 icon attr 추가
// ex ) <button icon='srch'></button>
// ready에서 호출
// datepicker icon만 예외로 comDate.js 에서 정의
function setIcon() {
  $("[icon='save']").prepend('<span class="fas fa-save"></span>&nbsp;&nbsp;');
  $("[icon='srch']").prepend('<span class="fas fa-search"></span>&nbsp;&nbsp;');
  $("[icon='copy']").prepend('<span class="fas fa-copy"></span>&nbsp;&nbsp;');
  $("[icon='new']").prepend('<span class="fas fa-plus"></span>&nbsp;&nbsp;');
  $("[icon='del']").prepend('<span class="fas fa-minus"></span>&nbsp;&nbsp;');
  $("[icon='add_row']").prepend('<span class="fas fa-plus-circle"></span>&nbsp;&nbsp;');
  $("[icon='del_row']").prepend('<span class="fas fa-minus-circle"></span>&nbsp;&nbsp;');
  $("[icon='edit']").prepend('<span class="fas fa-edit"></span>&nbsp;&nbsp;');
  $("[icon='excel']").prepend('<span class="fas fa-file-excel"></span>&nbsp;&nbsp;');
  $("[icon='reset']").prepend('<span class="fas fa-undo"></span>&nbsp;&nbsp;');
  $("[icon='grd-title']").prepend('<span class="fa fa-bars"></span>&nbsp;');
  $("[icon='check']").prepend('<span class="fas fa-check"></span>&nbsp;');

  $("[icon='input_srch']").each(function () {
    $(this).after(
      '<span style="margin: 0px 0px 0px -21px; cursor:pointer; position:absolute; line-height:2.6rem; font-size:14px;">' +
        '<i class="fas fa-search"></i></span>'
    );
    var tag_h = parseInt(gfnExtractNum($(this).css("height")));
    if (tag_h < 29) {
      $(this).next("span").css("line-height", "2.2rem");
    }
  });

  $("[icon='input_date']").each(function () {
    $(this).after(
      '<span style="margin: 0px 0px 0px -21px; cursor:pointer; position:absolute; line-height:2.6rem; font-size:14px;" class="cal-icon">' +
        '<i class="far fa-calendar-alt"></i></span>'
    );
    var tag_h = parseInt(gfnExtractNum($(this).css("height")));
    if (tag_h < 29) {
      $(this).next("span").css("line-height", "2.2rem");
    }
  });
}

// document ready 때 모든 화면에 공통으로 호출 할 함수
function setInitComm() {
  setIcon();
  setMask();
  // grd-title 높이 맞춰주기
  $(".grd-title").before(
    '<button class="btn" style="visibility:hidden; width: 0; padding-right: 0; padding-left: 0; margin-right: 0; margin-left: 0;">H</button>'
  );
}

// input mask
function setMask() {
  // type에 대한 로직은 comUtil.js의 gfnAutoHypen 함수에 정의
  var typeArr = ["phone", "business"]; // 새로운 type은 여기에 추가해주세요.

  for (var i = 0; i < typeArr.length; i++) {
    $("[mask='" + typeArr[i] + "']").each(function () {
      $(this).on("keyup", function () {
        var val = $(this).val();
        var type = $(this).attr("mask");

        $(this).val(gfnAutoHypen(val, type)); // gfnAutoHypen 함수는 comUtil.js 참고
      });
    });
  }
}

$(document).ready(function () {
  setInitComm();

  $(window).on("beforeunload", function () {
    if (checkChangeData()) {
      // 데이터 변경이 있을경우
      return "변경사항이 저장되지 않을 수 있습니다.(The changed can't be saved)";
    }
  });

  if (document.getElementById("btn_search")) {
    btnSrch = document.getElementById("btn_search");
    btnSrch.addEventListener("click", btnSrchClickHandler, true);
  }
  if (document.getElementById("btn_srch")) {
    btnSrch = document.getElementById("btn_srch");
    btnSrch.addEventListener("click", btnSrchClickHandler, true);
  }

  $("#searchForm")
    .find("input")
    .keydown(function (key) {
      if (key.keyCode == 13) {
        if (document.getElementById("btn_search")) {
          $("#btn_search").focus();
        } else if (document.getElementById("btn_srch")) {
          $("#btn_srch").focus();
        }
      }
    });

  $("#popForm")
    .find("input")
    .keydown(function (key) {
      if (key.keyCode == 13) {
        if (document.getElementById("btn_search")) {
          $("#btn_search").focus();
        } else if (document.getElementById("btn_srch")) {
          $("#btn_srch").focus();
        }
      }
    });

  $("#searchForm")
    .find("input")
    .change(function () {
      var inputId = $(this).attr("id");
      if (gfnIsNull($(this).val())) {
        $("#" + inputId + "_cd").val("");
      }
    });

  $("#popForm")
    .find("input")
    .change(function () {
      var inputId = $(this).attr("id");
      if (gfnIsNull($(this).val())) {
        $("#" + inputId + "_cd").val("");
      }
    });

  $(".clear_reset").on("click", function (e) {
    if (checkChangeData()) {
      if (!confirm(ld.changedButProceed)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }
    }

    $(".srchzone form input").each(function () {
      var resetValue = $(this).attr("reset_value");
      if (resetValue == null || resetValue == undefined || resetValue == "") {
        $(this).val("");
      } else {
        if ($(this).attr("icon") == "input_date") {
          if (resetValue === "false") {
            $(this).datepicker("setDate", false);
          } else {
            $(this).datepicker("setDate", resetValue);
          }
          var start_value = $(this).attr("reset_start_value");
          var end_value = $(this).attr("reset_end_value");
          if (!gfnIsNull(start_value)) {
            $(this).datepicker("start_value", start_value);
          }
          if (!gfnIsNull(end_value)) {
            $(this).datepicker("end_value", end_value);
          }
        } else {
          $(this).val(resetValue);
        }
      }
    });

    $(".srchzone form select").each(function () {
      var resetValue = $(this).attr("reset_value");
      if (resetValue == null || resetValue == undefined || resetValue == "") {
        $(this).val("");
      } else {
        $(this).val(resetValue);
      }
      $(this).trigger("change");
    });

    // resetObjs();  //grid  reset
  });

  $(document).keydown(function (e) {
    if (e.target.nodeName != "INPUT" && e.target.nodeName != "TEXTAREA") {
      if (e.keyCode === 8) {
        //return false;
      }
    }
  });

  var csrftoken = getCookie("csrftoken");
  $.ajaxSetup({
    beforeSend: function (xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    },
  });

  RealGridJS.setTrace(false);
  //RealGridJS.setRootContext("{% static '/plugins/realgridjs' %}");
  RealGridJS.setRootContext("/static/plugins/realgridjs");
  dataProvider = new RealGridJS.LocalDataProvider();

  var mustArr = $(".mustc, .mustc2, .mustc3");
  for (var index = 0; index < mustArr.length; index++) {
    id = mustArr[index].id;
    $("label[for=" + id + "]").prepend('<i class="fas fa-star-of-life" style="color:red;margin: 0 5px 0 0; font-size:0.5rem; "></i>');
  }

  // readonly input을 focus 못하게 하기!
  var readonlyArr = $("input[readonly]");
  for (var index = 0; index < readonlyArr.length; index++) {
    $(readonlyArr[index]).on("focus", function () {
      this.blur();
    });
  }
}); //end document.ready

this.btnSrchClickHandler = function (e) {
  if (checkChangeData()) {
    if (!confirm(ld.changedButProceed)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }
  }
};

function chkMustFeild(mustname) {
  if (mustname == null || mustname == "") {
    mustname = "mustc";
  }
  var chkTitle = "";
  var result = true;
  $("." + mustname).each(function () {
    var val = $(this).val();

    if ($.trim(val) == "") {
      if (result) {
        $(this).focus();
        result = false;
        chkTitle = $(this).attr("title");
      }
      $(this).addClass("unvaild-input");
    } else {
      $(this).removeClass("unvaild-input");
    }
  });

  if (!result) {
    if (chkTitle != "" && chkTitle !== undefined) {
      // gmessage(null, '[' + chkTitle + '] 입력값이 누락 되었습니다.');
      gfnNoticeModalShow(ld.notice_modal, chkTitle + "입력값이 누락 되었습니다.");
    } else {
      gfnNoticeModalShow(ld.notice_modal, "필수입력값이 누락 되었습니다.");
      // gmessage(null, '필수입력값이 누락 되었습니다.');
      //alert( '필수입력값이 누락 되었습니다.');
    }
  }
  return result;
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
}

/* end csrf */

function resetObjs() {
  //화면 reset
  var a,
    t = getGrdArr();
  try {
    for (a in t) {
      if ("object" != typeof window[t[a]]) continue;
      var grd = window[t[a]];
      grd.grid.cancel();
      grd.provider.clearRows();
      $("#frowinfo_" + $(grd).attr("id")).text("");
    }
  } catch (er) {
    // console.log("ERROR Window Grid reset !!!!", er)
  }
}

/*
 *checkChangeObj : 변경여부 체크할 object 선언
 */

// function checkChangeObj() {
//   var arrChkObj;
//   arrChkObj = ["grd", "grd1", "grd2", "grd3", "grd4", "grd5", "historyGrid", "summaryGrid", "detailGrid"];
//   return arrChkObj;
// }

/*
 *isGrdModified : grid 수정여부
 */
function isGrdModified(_grd) {
  if ("object" == typeof _grd.grid) {
    var isIEditing = _grd.grid.isItemEditing();
    if (isIEditing) return true;
  }

  var rows = null;
  var state = $(':radio[name="rbRowStateArray"]:checked').val();

  if ("object" != typeof _grd.grid) return false;

  if (!state || state == "all") {
    rows = _grd.provider.getAllStateRows(); // RowState.NONE은 포함되지 않는다.
  } else {
    rows = _grd.provider.getStateRows(state);
  }
  if (rows.deleted.length > 0 || rows.updated.length > 0 || rows.created.length > 0) {
    return true;
  } else {
    return false;
  }
}

/*
  현재 활성화 되어있는 탭의 그리드만 체크하도록 하기 위한 함수
*/
function fn_findActivetab() {
  var div = $(".nav-tabs .active");
  var tabId = "";
  if (!gfnIsNull(div)) {
    tabId = div.attr("href");
  }
  return tabId;
}

/* 
  param isClose : boolean  탭 종료버튼 클릭여부 
*/
function checkChangeData(isClose) {
  var tabObj = $(fn_findActivetab()); //활성화 되어있는 탭 Obj
  var a,
    t = getGrdArr();
  try {
    for (a in t) {
      var thisGrdId = t[a];
      if (!gfnIsNull(tabObj)) {
        if (!isClose && gfnIsNull(tabObj.find($("#" + thisGrdId)))) continue; //활성화된 탭이 아니면 Continue처리
      }

      if ("object" != typeof window[t[a]]) continue;
      var isGModified = isGrdModified(window[t[a]]);
      if (isGModified) {
        return true;
      }
    }
  } catch (er) {
    // console.log("ERROR Window checkChangeData !!!!", er)
  }
  //console.log("Window checkChangeData  Not Modify !!!!")
  return false;
}

/*
 *function명 :getUrlInfo
 *설명 : 쿼리스트링을 JSON형태로 변환
 */
function getUrlInfo(query) {
  if (typeof query != "string") query = location.href;
  var obj = {},
    url = "",
    param = "",
    qs = query.indexOf("?"),
    eq = query.indexOf("="),
    am = query.indexOf("&");
  var min = eq == -1 ? am : am == -1 ? eq : Math.min(eq, am);

  if (qs == -1) {
    if (eq == -1 && am == -1) url = query;
    else param = query;
  } else if (min == -1 || qs < min) {
    url = query.substring(0, qs);
    param = query.substr(qs + 1);
  } else {
    param = query;
  }
  obj["url"] = url;
  var a = param.split("&"),
    b;
  for (var i = 0, n = a.length; i < n; i++)
    if (a[i] !== "") {
      b = a[i].split("=");
      if (b[0] !== "") obj[b[0]] = b[1] || "";
    }
  return obj;
}

/*
 *function명 :getVar
 *설명 : json value 반환
 */
function getVar(name) {
  var obj = getUrlInfo();
  return typeof obj[name] != "undefined" ? obj[name] : false;
}

/**
 *
 *
 * @param {*} tag 콤보로 만들 태그 id
 * @param {*} magic_const 콤보를 만들려는 code_master의 magic const
 * @param {*} isAll 전체를 포함한 콤보인지 여부 true false
 * @param {*} type_code 타입 코드( 기본 code_deail
 *                                 service_manage 서비스 목록 )
 * @param {*} isSync 동기시 true 설정
 * @param {*} url 호출할 url이 다른경우
 * @param {*} args jsonData에 추가해야하는 것들이 있는경우 사용
 */
this.gfn_initDropList = function (tag, magic_const, isAll, type_code, isSync, url, args) {
  // addParams, changeFunc,  ??? 어떻게 처리하지
  //console.log("fn.setDropList....");
  //console.log("addParams....", addParams);
  if (gfnIsNull(isAll)) isAll = false;
  if (gfnIsNull(type_code)) type_code = "code_detail";
  if (gfnIsNull(isSync)) isSync = false;
  if (gfnIsNull(url)) url = "/comm/get_combo_data";

  // console.log(isAll);
  var select = $("#" + tag);
  // 비우기 먼저
  select.html("");

  var jsonData = {
    p_type_code: type_code,
    p_magic_const: magic_const,
    tag: tag,
    isAll: isAll,
  };

  if (!gfnIsNull(args)) {
    var keys = Object.keys(args);
    for (var index = 0; index < keys.length; index++) {
      var key = keys[index];
      jsonData[key] = args[key];
    }
  }

  if (isSync) {
    gfn_ajaxTransaction("combo", url, "", "result=output", jsonData, "comboCallBack", "", false, false);
  } else {
    gfn_ajaxTransaction("combo", url, "", "result=output", jsonData, "comboCallBack", "", false);
  }
};

/**
 *
 *
 * @param {*} tags 콤보로 만들 태그 ids
 * @param {*} magic_consts 콤보를 만들려는 code_master의 magic consts
 * @param {*} isAlls 전체를 포함한 콤보인지 여부 true:1 false:0
 * @param {*} type_codes 타입 코드( 기본 code_deail
 *                                 service_manage 서비스 목록 )
 */
this.gfn_setCombos = function (tags, magic_consts, isAlls, type_codes) {
  arrTag = tags.split(",");
  arrMagicConsts = magic_consts.split(",");
  arrIsAll = isAlls.split(",");
  arrtypeCodes = type_codes.split(",");
  for (var i = 0; i < arrTag.length; i++) {
    var tag = arrTag[i];
    var magic_const = arrMagicConsts[i];
    var isAll = true;
    if (arrIsAll[i] != "1") isAll = false;
    var type_code = arrtypeCodes[i];
    gfn_initDropList(tag, magic_const, isAll, type_code);
  }
};

/**
 *
 *
 * @param {*} tag multi select 만들 태그 id
 * @param {*} magic_const multi select를 만들려는 code_master의 magic const
 * @param {*} options multi select의 width, height
 * @param {*} type_code 프로시저 type_code | default = 'code_detail'
 */
this.gfn_initMultiDropList = function (tag, magic_const, options, type_code) {
  // addParams, changeFunc,.... 추후 정의
  if (gfnIsNull(type_code)) type_code = "code_detail";

  var select = $("#" + tag);
  // 비우기 먼저
  select.html("");

  var jsonData = {
    p_magic_const: magic_const,
    p_type_code: type_code,
    tag: tag,
    isAll: false,
  };

  gfn_ajaxTransaction("multiCombo", "/comm/get_combo_data", "", "result=output", jsonData, "comboCallBack", options);
};

this.comboCallBack = function (id, errcode, errmessage, params) {
  switch (id) {
    case "combo":
      var header = dataset.result[0];
      var select = $("#" + header.tag);
      if (header.isAll == true) {
        select.append("<option value=''>" + ld.all + "</option>");
      } else {
        select.attr("reset_value", dataset.result[1].cd);
      }

      for (var i = 1; i < dataset.result.length; i++) {
        var value = dataset.result[i].cd;
        var label = dataset.result[i].val;
        select.append('<option value="' + value + '">' + label + "</option>");
      }
      break;

    case "multiCombo":
      var header = dataset.result[0];
      var select = $("#" + header.tag);
      select.attr("multiple", "multiple");

      for (var i = 1; i < dataset.result.length; i++) {
        var value = dataset.result[i].cd;
        var label = dataset.result[i].val;
        select.append('<option value="' + value + '">' + label + "</option>");
      }

      setMultiCombo(header.tag, dataset.addParam);

      break;
    default:
      break;
  }
};

// multiselect 달아주는 부분 (options 인자는 추후 정의 예정)
function setMultiCombo(_id, options) {
  var width = 145;

  if (options) {
    if (options.width) {
      width = options.width;
    }
  }

  $("#" + _id + "[multiple]").multiselect({
    columns: 1, // how many columns should be use to show options
    search: true, // include option search box
    // search filter options
    searchOptions: {
      delay: 100, // time (in ms) between keystrokes until search happens
      showOptGroups: false, // show option group titles if no options remaining
      searchText: true, // search within the text
      searchValue: false, // search within the value
      onSearch: function (element) {}, // fires on keyup before search on options happens
    },

    // plugin texts
    texts: {
      placeholder: ld.select, // placeholder
      search: ld.searchText, // 검색창 placeholder
      selectedOptions: "개 선택(추후정의)", // select의 내용이 태그 밖으로 넘칠 때 대체 할 문자열
      selectAll: "모두선택", // select all text
      unselectAll: "모두해제", // unselect all text
      noneSelected: "None Selected", // None selected text
    },

    // general options
    selectAll: true, // add select all option
    selectGroup: false, // select entire optgroup
    minHeight: 100, // minimum height of option overlay
    maxHeight: 200, // maximum height of option overlay
    minWidth: width,
    maxWidth: width, // maximum width of option overlay (or selector)
    maxPlaceholderWidth: null, // maximum width of placeholder button
    maxPlaceholderOpts: 10, // maximum number of placeholder options to show until "# selected" shown instead
    showCheckbox: true, // display the checkbox to the user
    optionAttributes: [], // attributes to copy to the checkbox from the option element

    // Callbacks
    onLoad: function (element) {}, // fires at end of list initialization
    onOptionClick: function (element, option) {}, // fires when an option is clicked
    onControlClose: function (element) {}, // fires when the options list is closed
    onSelectAll: function (element, selected) {}, // fires when (un)select all is clicked
    onPlaceholder: function (element, placeholder, selectedOpts) {}, // fires when the placeholder txt is up<a href="https://www.jqueryscript.net/time-clock/">date</a>d

    // @NOTE: these are for future development
    minSelect: false, // minimum number of items that can be selected
    maxSelect: false, // maximum number of items that can be selected
  });

  multiComboCss(_id, options);
}

function multiComboCss(_id, options) {
  var width = "145px";
  var height = "29px";

  if (options) {
    if (options.width) {
      width = options.width + "px";
    }
    if (options.height) {
      height = options.height + "px";
    }
  }

  // multiCombo 호출 하고 나서 css 적용
  var select_id = $("#" + _id)
    .next("div")
    .attr("id");
  $("#" + select_id).css({
    width: width,
    height: height,
  }); // select div

  $(".ms-options-wrap button").css({
    width: "100%",
    height: "100%",
    border: "solid 1px #ccc",
    "margin-top": "0",
  }); // select div 자식

  $(".ms-options").css({
    left: "auto",
    "margin-top": "0",
  }); // option을 감싸는 부분

  $(".ms-options a").css({
    // "float": "left"
  }); // '모두선택' 부분

  $(".ms-options ul li").css({
    // "clear": "both",
    width: "100%",
    // "height": height
  }); // option

  $(".ms-options ul li label").css({
    margin: "0",
    "font-weight": "normal",
    height: "100%",
    "text-align": "left",
  }); // option의 label

  $(".ms-options ul li label input").css({
    width: "auto",
    height: "auto",
  }); // option의 checkbox

  $(".ms-options-wrap span").css({
    "font-size": "12px",
  }); // select tag 안의 내용

  $(".ms-options-wrap").css({
    float: "left",
  }); // select tag 화면에 보여지는 부분의 wrapper

  // mustc css
  $("select.mustc").next(".ms-options-wrap").children("button").css("background-color", "#fafad2");
}

// function setCombo(tsels, gubun_cd, addParam, changeFunc, isAll, selkey) {

//   // console.log("quriCombo...");
//   // console.log("addParam...", addParam);
//   var tselects = tsels.split(',');
//   // 비우기 먼저
//   for (var i = 0; i < tselects.length; i++) {
//     var select = $('#' + tselects[i]);
//     if (select != null) {
//       //select.html('');
//       select.setDropList(gubun_cd, addParam, changeFunc, isAll, selkey);
//     }
//   }
//   return false;
// }

this.gfn_setFormDisabled = function (formId, bYesNo) {
  var f = document.getElementById(formId),
    s,
    opacity;
  // s = f.style;
  // opacity = bYesNo? '40' : '100';
  // s.opacity = s.MozOpacity = s.KhtmlOpacity = opacity/100;
  // s.filter = 'alpha(opacity='+opacity+')';
  for (var i = 0; i < f.length; i++) f[i].disabled = bYesNo;
};

/**
 * 팝업에서 uid가 비었는지 확인하기 위한 함수
 * 학생검색시 학과 검색시 등등
 * @param {*} valtag 학번과 같이 데이터를 담는 태그아이디
 * @param {*} uidtag 학번_uid 와 같이 uid를 담는 태그아이디
 * @returns  true인 경우에 팝업을 띄워서 정확한 데이터를 선택하여야 한다.
 */
this.checkValUid = function (valtag, uidtag) {
  var val = $("#" + valtag).val();
  var uid = $("#" + uidtag).val();
  if (gfnIsNull(val) == false && gfnIsNull(uid)) {
    return true;
  }
  return false;
};

/**
 *
 *
 * @param {*} stuTag student의 이름 혹은 학번을 입력받는 id 
 * @param {*} uidTag student_uid를 저장하는 id 
 * @param {*} modalTag 학생검색 모달의 id 
 * @param {*} srchFunc 조회시 호출되는 함수 
 * @param {*} srchParam 조회함수 호출시 넘겨야 할 파라매터
 * @param {*} otherObj 학생검색시 전달되는 시점 관련 파라매터 
 *            otherObj = {
*               year 년도
                semester_uid 학기
                month 월  
                effective_date 유효일자
                procGubun_uid 과정구분
                schGubun_uid 장학구분
                stuGubun_uid 학생구분
                in_school_semester 재학학기
                before_score 이전학점
                before_score_avg 이전평점
                before_convert_score 환산점수(이전)
                income_section 소득구간
 *            }
 *            otherObj 아무것도 전달 안되면 현재일로 처리함 
 * @returns
 */
this.gfn_checkStudent = function (stuTag, uidTag, modalTag, srchFunc, srchParam, otherObj, isInner) {
  if (checkValUid(stuTag, uidTag)) {
    var callBackParams = {
      stuTag: stuTag,
      uidTag: uidTag,
      modalTag: modalTag,
      srchFunc: srchFunc,
      srchParam: srchParam,
      otherObj: otherObj,
      isInner: isInner,
    };
    var tempObj = JSON.parse(JSON.stringify(otherObj));

    if (gfnIsNull(otherObj.lecture_year)) {
      otherObj.lecture_year = tempObj.year;
    }
    if (gfnIsNull(otherObj.semester_uid)) {
      otherObj.semester_uid = tempObj.semester;
    }
    if (gfnIsNull(otherObj.lecture_month)) {
      otherObj.lecture_month = tempObj.month;
    }

    var args = JSON.parse(JSON.stringify(otherObj));
    if (stuTag.substring(0, 1) == "#") {
      args.studentId_name = $(stuTag).val();
    } else {
      args.studentId_name = $("#" + stuTag).val();
    }
    // console.log(args)
    gfn_ajaxTransaction("checkStudent", "/sch_pup_1010/srch", "", "checkCallBackStudentData=output", args, "checkCallback", callBackParams);
    return false;
  }
  return true;
};

/**
 *
 *
 * @param {*} stuTag department 이름 혹은 학번을 입력받는 id
 * @param {*} uidTag department uid 저장하는 id
 * @param {*} modalTag 학과검색 모달의 id
 * @param {*} srchFunc 조회시 호출되는 함수
 * @param {*} srchParam 조회함수 호출시 넘겨야 할 파라매터
 * @returns
 */
this.gfn_checkDept = function (deptTag, uidTag, modalTag, srchFunc, srchParam, isInner) {
  deptTag = deptTag.replace("#", "");
  uidTag = uidTag.replace("#", "");
  if (checkValUid(deptTag, uidTag)) {
    var callBackParams = {
      deptTag: deptTag,
      uidTag: uidTag,
      modalTag: modalTag,
      srchFunc: srchFunc,
      srchParam: srchParam,
      isInner: isInner,
    };
    var args = {};
    if (deptTag.substring(0, 1) == "#") {
      args.dept_name = $(deptTag).val();
    } else {
      args.dept_name = $("#" + deptTag).val();
    }

    gfn_ajaxTransaction("checkDepartment", "/sch_pup_1030/srch", "", "checkCallBackDepartmentData=output", args, "checkCallback", callBackParams);
    return false;
  }
  return true;
};

this.gfn_checkBuseo = function (buseoTag, uidTag, modalTag, srchFunc, srchParam, isInner) {
  buseoTag = buseoTag.replace("#", "");
  uidTag = uidTag.replace("#", "");
  if (checkValUid(buseoTag, uidTag)) {
    var callBackParams = {
      deptTag: buseoTag,
      uidTag: uidTag,
      modalTag: modalTag,
      srchFunc: srchFunc,
      srchParam: srchParam,
      isInner: isInner,
    };
    var args = {};
    if (buseoTag.substring(0, 1) == "#") {
      args.deptName = $(buseoTag).val();
    } else {
      args.deptName = $("#" + buseoTag).val();
    }

    gfn_ajaxTransaction("checkBuseo", "/sch_pup_1040/srch", "", "checkCallBackBuseoData=output", args, "checkCallback", callBackParams);
    return false;
  }
  return true;
};

this.checkCallback = function (trId, strErrorCode, strErrorMsg) {
  var isInner = dataset.addParam.isInner;
  if (gfnIsNull(isInner)) isInner = false;

  switch (trId) {
    case "checkStudent":
      var stuTag = dataset.addParam.stuTag;
      var uidTag = dataset.addParam.uidTag;
      var modalTag = dataset.addParam.modalTag;
      var otherObj = dataset.addParam.otherObj;
      var srchFunc = dataset.addParam.srchFunc;
      var srchParam = dataset.addParam.srchParam;
      if (dataset.checkCallBackStudentData.length == 1) {
        if (stuTag.substring(0, 1) != "#") {
          stuTag = "#" + stuTag;
        }
        if (uidTag.substring(0, 1) != "#") {
          uidTag = "#" + uidTag;
        }

        // if(isInner === true ){
        //   parent.window.$(uidTag).val(dataset.checkCallBackStudentData[0].student_uid);
        //   parent.window.$(stuTag).val(dataset.checkCallBackStudentData[0].student_number);
        // }
        // else{
        $(uidTag).val(dataset.checkCallBackStudentData[0].student_uid);
        $(stuTag).val(dataset.checkCallBackStudentData[0].student_number);
        // }

        // 다른태그들의 값을 초기화 해야할때 필요시 추가 바람
        if (!gfnIsNull(otherObj.otherTag)) {
          var otherTags = otherObj.otherTag;
          var stu_data = dataset.checkCallBackStudentData[0];
          if (!gfnIsNull(otherTags.nameTag)) {
            $("#" + otherTags.nameTag).val(stu_data.student_name);
          }
          if (!gfnIsNull(otherTags.numberTag)) {
            $("#" + otherTags.numberTag).val(stu_data.student_number);
          }
          if (!gfnIsNull(otherTags.deptNameTag)) {
            $("#" + otherTags.deptNameTag).val(stu_data.department_name);
          }
          if (!gfnIsNull(otherTags.bankNameTag)) {
            $("#" + otherTags.bankNameTag).val(stu_data.bank_name);
          }
          if (!gfnIsNull(otherTags.accountNumTag)) {
            $("#" + otherTags.accountNumTag).val(stu_data.bank_account_number);
          }
          if (!gfnIsNull(otherTags.depoStockTag)) {
            $("#" + otherTags.depoStockTag).val(stu_data.depositor);
          }
          if (!gfnIsNull(otherTags.personUidTag)) {
            $("#" + otherTags.personUidTag).val(stu_data.person_uid);
          }
          if (!gfnIsNull(otherTags.deptUidTag)) {
            $("#" + otherTags.deptUidTag).val(stu_data.department_code_uid);
          }
          if (!gfnIsNull(otherTags.statusNameTag)) {
            $("#" + otherTags.statusNameTag).val(stu_data.status_code_name);
          }
        }

        if (gfnIsNull(srchParam)) {
          srchFunc();
        } else {
          srchFunc(srchParam);
        }
      } else {
        if (isInner === true) {
          parent.window.gfnNoticeModalShow(ld.notice_modal, ld.search_stu_err);
        } else {
          gfnNoticeModalShow(ld.notice_modal, ld.search_stu_err);
        }

        if (modalTag.substring(0, 1) != "#") {
          modalTag = "#" + modalTag;
        }
        if (isInner === true) {
          gfn_openInnerModal(modalTag.substring(1, modalTag.length), "/sch_pup_1010");
          parent.window.$(modalTag).on("shown.bs.modal", function () {
            var idx = modalTag.indexOf("_modal");
            var ifrm = parent.window.gfn_getiframeDocument(modalTag.substring(1, idx) + "_frame");
            ifrm.setOtherInfo(
              otherObj.year,
              otherObj.semester_uid,
              otherObj.month,
              otherObj.effective_date,
              otherObj.procGubun_uid,
              otherObj.schGubun_uid,
              otherObj.stuGubun_uid,
              otherObj.in_school_semester,
              otherObj.before_score,
              otherObj.before_score_avg,
              otherObj.before_convert_score,
              otherObj.income_section
            );
            ifrm.setData(dataset.checkCallBackStudentData);
            parent.window.$(modalTag).off("shown.bs.modal");
          });
        } else {
          gfn_openModal(modalTag.substring(1, modalTag.length), "/sch_pup_1010");
          $(modalTag).on("shown.bs.modal", function () {
            var idx = modalTag.indexOf("_modal");
            var ifrm = gfn_getiframeDocument(modalTag.substring(1, idx) + "_frame");
            ifrm.setOtherInfo(
              otherObj.year,
              otherObj.semester_uid,
              otherObj.month,
              otherObj.effective_date,
              otherObj.procGubun_uid,
              otherObj.schGubun_uid,
              otherObj.stuGubun_uid,
              otherObj.in_school_semester,
              otherObj.before_score,
              otherObj.before_score_avg,
              otherObj.before_convert_score,
              otherObj.income_section
            );
            ifrm.setData(dataset.checkCallBackStudentData);
            $(modalTag).off("shown.bs.modal");
          });
        }
      }
      break;

    case "checkDepartment":
      var deptTag = dataset.addParam.deptTag;
      var uidTag = dataset.addParam.uidTag;
      var modalTag = dataset.addParam.modalTag;
      var srchFunc = dataset.addParam.srchFunc;
      var srchParam = dataset.addParam.srchParam;
      if (dataset.checkCallBackDepartmentData.length == 1) {
        if (deptTag.substring(0, 1) != "#") {
          deptTag = "#" + deptTag;
        }
        if (uidTag.substring(0, 1) != "#") {
          uidTag = "#" + uidTag;
        }
        $(uidTag).val(dataset.checkCallBackDepartmentData[0].organization_uid);
        $(deptTag).val(dataset.checkCallBackDepartmentData[0].organization_name);
        if (gfnIsNull(srchParam)) {
          srchFunc();
        } else {
          srchFunc(srchParam);
        }
      } else {
        if (modalTag.substring(0, 1) != "#") {
          modalTag = "#" + modalTag;
        }
        if (isInner === true) {
          parent.window.gfnNoticeModalShow(ld.notice_modal, ld.search_buseo_err);
          parent.window.gfn_openInnerModal(modalTag.substring(1, modalTag.length), "/sch_pup_1030");

          parent.window.$(modalTag).on("shown.bs.modal", function () {
            var idx = modalTag.indexOf("_modal");
            var ifrm = parent.window.gfn_getiframeDocument(modalTag.substring(1, idx) + "_frame");
            ifrm.setData(dataset.checkCallBackDepartmentData);
            parent.window.$(modalTag).off("shown.bs.modal");
          });
        } else {
          gfnNoticeModalShow(ld.notice_modal, ld.search_buseo_err);
          gfn_openModal(modalTag.substring(1, modalTag.length), "/sch_pup_1030");

          $(modalTag).on("shown.bs.modal", function () {
            var idx = modalTag.indexOf("_modal");
            var ifrm = gfn_getiframeDocument(modalTag.substring(1, idx) + "_frame");
            ifrm.setData(dataset.checkCallBackDepartmentData);
            $(modalTag).off("shown.bs.modal");
          });
        }
      }
      break;

    case "checkBuseo":
      var buseoTag = dataset.addParam.buseoTag;
      var uidTag = dataset.addParam.uidTag;
      var modalTag = dataset.addParam.modalTag;
      var srchFunc = dataset.addParam.srchFunc;
      var srchParam = dataset.addParam.srchParam;
      if (dataset.checkCallBackBuseoData.length == 1) {
        if (buseoTag.substring(0, 1) != "#") {
          buseoTag = "#" + buseoTag;
        }
        if (uidTag.substring(0, 1) != "#") {
          uidTag = "#" + uidTag;
        }
        $(uidTag).val(dataset.checkCallBackBuseoData[0].organization_uid);
        $(buseoTag).val(dataset.checkCallBackBuseoData[0].organization_name);
        if (gfnIsNull(srchParam)) {
          srchFunc();
        } else {
          srchFunc(srchParam);
        }
      } else {
        if (modalTag.substring(0, 1) != "#") {
          modalTag = "#" + modalTag;
        }

        if (isInner === true) {
          parent.window.gfnNoticeModalShow(ld.notice_modal, ld.search_buseo_err);
          parent.window.gfn_openInnerModal(modalTag.substring(1, modalTag.length), "/sch_pup_1040");
          parent.window.$(modalTag).on("shown.bs.modal", function () {
            var idx = modalTag.indexOf("_modal");
            var ifrm = parent.window.gfn_getiframeDocument(modalTag.substring(1, idx) + "_frame");
            ifrm.setDept(dataset.checkCallBackBuseoData);
            parent.window.$(modalTag).off("shown.bs.modal");
          });
        } else {
          gfnNoticeModalShow(ld.notice_modal, ld.search_buseo_err);
          gfn_openModal(modalTag.substring(1, modalTag.length), "/sch_pup_1040");
          $(modalTag).on("shown.bs.modal", function () {
            var idx = modalTag.indexOf("_modal");
            var ifrm = gfn_getiframeDocument(modalTag.substring(1, idx) + "_frame");
            ifrm.setDept(dataset.checkCallBackBuseoData);
            $(modalTag).off("shown.bs.modal");
          });
        }
      }
      break;

    default:
      break;
  }
};

this.gfn_getSysMsg = function (serviceId, output, callBack, programName, programId) {
  if (gfnIsNull(callBack)) callBack = "this.fn_callBack";
  argument = {
    call_back: callBack,
    program_name: programName,
    program_id: programId,
  };
  gfn_ajaxTransaction(serviceId, "/comm/get_sys_msg", "", output + "=output", argument, "getMsgCallBack", { output: output }, false);
};

this.getMsgCallBack = function (id, errCode, errMessage, params) {
  var output = dataset.addParam["output"];
  var data = dataset[output][0];

  //존재하지 않는 프로그램 호출
  if (errCode === 1) {
    gfnNoticeModalShow(ld.notice_modal, "[ERROR] getMsgCallBack:: wrong program name or program id");
    return;
  }

  var strExpression = data.call_back + "(id,errCode,errMessage,params)";
  eval(strExpression);
};

this.gfn_writeSysMsg = function (divTag, msgs) {
  var msg_arr = msgs.split("\n");
  for (var index = 0; index < msg_arr.length; index++) {
    $("#" + divTag).append("<ul>" + msg_arr[index] + "</ul>");
  }
};
