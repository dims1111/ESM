Date.prototype.getYMD = function () {
    var year = this.getFullYear();
    var month = this.getMonth() + 1;
    var day = this.getDate();

    return year + '-' + (month > 9 ? '' : '0') + month + '-' + (day > 9 ? '' : '0') + day;
}

Date.prototype.getYM = function () {
    var year = this.getFullYear();
    var month = this.getMonth() + 1;
    var day = this.getDate();

    return year + '-' + (month > 9 ? '' : '0') + month;
}

Date.prototype.getLastDay = function () {
    var month = this.getMonth() + 1;
    var temp = new Date(this);

    // 12월의 경우 별도로 예외처리 필요.
    // 다음달의 0일(따라서 현재 월의 마지막날)을 가져오는데, 12월의 경우 다음달을 구하면
    // 연도가 변하면서 잘못된 값을 가져오는 것으로 보임.
    if (month == '12') {
        return '31';
    }

    temp.setMonth(month);

    if (temp.getMonth() != month) {
        temp.setMonth(temp.getMonth() - 1);
    }

    temp.setDate(0);

    return temp.getDate();
}

this.gfn_getToday = function () {
    //svcID, callUrl, inDatasets, outDatasets, argument, callbackFunc, showProgress, bAsync
    gfn_ajaxTransaction('get_today', "/comm/get_today", "", "rdata=output", null, null, null, false);         
    var today = dataset.rdata[0].today;
    // console.log("today..", today);
    return today;
}

$.fn.datepicker.dates['kr'] = {
    days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
    daysShort: ["일", "월", "화", "수", "목", "금", "토", "일"],
    daysMin: ["일", "월", "화", "수", "목", "금", "토", "일"],
    months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    monthsShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
};


/**
 
 @param {string} _id datepicker 사용 할 id
 dateRangePicker 사용 시 '시작날짜 id, 종료날짜 id'

 @param {string} format 날짜 포맷 설정 | 문자열, (대소문자 구분 x)
 Y : yyyy // M: yyyy-mm // D: yyyy-mm-dd | default: D

 @param {string} setDate 날짜 초기화 | 문자열
 N : 설정 안함 | default : 현재 날짜

 @param {string} range dateRangePicker 사용 여부 | default : false

 @param {string} deleteMonArr 비활성화 시키고싶은 월 을 배열에 number로 담아 넘긴다. ex ) [1,2,3,4]

*/
function gfn_datepickerInit(_id, format, setDate, range, deleteMonArr) {
    var option = {
        autoclose: true,
        language: ld.datepickerlang
    };

    if (format == '' || format == null || format == undefined) {
        format = 'D';
    }

    if (setDate == '' || setDate == null || setDate == undefined) {
        setDate = 'now';
    }

    format = format.toUpperCase();
    if (format == 'Y') {
        option.format = "yyyy"
        option.minViewMode = 2
    }

    if (format == 'M') {
        option.format = "yyyy-mm"
        option.minViewMode = 1

        if (!gfn_isNull(deleteMonArr)) {
            option.beforeShowMonth = function (date) {
                for (var i = 0; i < deleteMonArr.length; i++) {
                    if (date.getMonth() + 1 == deleteMonArr[i]) {
                        return false;
                    }
                }
            }
        }
    }

    if (format == 'D') {
        option.format = "yyyy-mm-dd"
    }

    setDate = setDate.toUpperCase();
    if (setDate == 'N') {
        setDate = false;
    }
    if (!range) {
        // datepicker set, changeMonth event listener
        // deleteMonArr에 값 있을 때, 타이핑으로 지워진 달 입력 못하게 막기
        $("#" + _id).datepicker(option).datepicker("setDate", setDate).on('changeDate', function (e) {
            if (jQuery.inArray(e.date.getMonth() + 1, deleteMonArr) >= 0) {
                $("#" + _id).val('');
            }
        });
        $("#" + _id).attr('reset_value', setDate);
        $("#" + _id).attr("autocomplete", "off");

        // $("#" + _id).after('<span style="position:absolute; margin: 3px 0px 0px -17px; cursor:pointer; font-size: 14px;" class="cal-icon">'
        //     + '<i class="far fa-calendar-alt"></i></span>');
    }

    else {
        dateRangePickerD(_id, option, setDate);
    }

    // icon 클릭 시 datepicker focus 가도록
    $(".cal-icon").on("click", function () {
        var inputT = $(this).prev();
        // inputT.trigger("click");
        inputT.datepicker().focus();
    });

    // // val 함수로 값 지정 시 datepicker 내부 포커스도 움직이도록
    // $("[icon='input_date']").on("focus", function () {
    //     $(this).datepicker("setDate", $(this).val());
    // });
}

// dateRangePicker 함수 (gfn_datepickerInit 에서 호출)
function dateRangePickerD(_id, option, setDate) {
    var idArr = _id.replace(/[\t\s]/g, '').split(",");
    var dateArr = setDate.replace(/[\t\s]/g, '').split(",");
    var startDate_id = idArr[0];
    var endDate_id = idArr[1];
    var setStartDate = dateArr[0];
    var setEndDate = dateArr[1];

    if (dateArr.length > 1) {
        if (setStartDate == "") {
            setStartDate = 'now';
        }
        if (setEndDate == "") {
            setEndDate = 'now';
        }
        if (setStartDate == "N") {
            setStartDate = false;
        }
        if (setEndDate == "N") {
            setEndDate = false;
        }
    }

    else {
        setStartDate = setDate;
        setEndDate = setDate;
    }

    $("#" + startDate_id).attr("autocomplete", "off");
    $("#" + endDate_id).attr("autocomplete", "off");

    $("#" + startDate_id).datepicker(option).datepicker("setDate", setStartDate);
    $("#" + endDate_id).datepicker(option).datepicker("setDate", setEndDate);

    $("#" + startDate_id).datepicker(option).datepicker("setEndDate", setEndDate);
    $("#" + endDate_id).datepicker(option).datepicker("setStartDate", setStartDate);

    $("#" + startDate_id).attr('reset_value', setStartDate);
    $("#" + endDate_id).attr('reset_value', setEndDate);

    $("#" + startDate_id).attr('reset_end_value', setEndDate);
    $("#" + endDate_id).attr('reset_start_value', setStartDate);

    $("#" + startDate_id).datepicker(option).on('change', function () {
        var setStartDate = $(this).val();
        $("#" + endDate_id).datepicker('setStartDate', setStartDate);
    });

    $("#" + endDate_id).datepicker(option).on('change', function () {
        var setEndDate = $(this).val();
        $("#" + startDate_id).datepicker('setEndDate', setEndDate);
    });

}

/**
 * 이번 달의 첫째 날과 마지막 날 반환 ('yyyy-mm-dd') 형식으로
 * addMonth : 현재 월에서 더할 값
*/
function gfn_thisMonth(addMonth) {
    var value = [];

    var now = new Date();
    var nowYear = now.getYear();
    var firstDate, lastDate;

    if (gfn_isNull(addMonth)) addMonth = 0;

    var formatDate = function (date) {
        var myMonth = date.getMonth() + 1;
        var myWeekDay = date.getDate();

        var addZero = function (num) {
            if (num < 10) {
                num = "0" + num;
            }
            return num;
        }
        var md = addZero(myMonth) + "-" + addZero(myWeekDay);

        return md;
    }

    firstDate = new Date(now.getYear(), now.getMonth() + addMonth, 1);
    lastDate = new Date(now.getYear(), now.getMonth() + 1 + addMonth, 0);
    nowYear += (nowYear < 2000) ? 1900 : 0;
    value.push(nowYear + "-" + formatDate(firstDate));
    value.push(nowYear + "-" + formatDate(lastDate));
    return value;
}

function gfn_today() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var today = {};

    if (m < 10) {
        m = "0" + m;
    }

    if (d < 10) {
        d = "0" + d;
    }

    today = {
        ymd: String(y + '-' + m + '-' + d),
        ym: String(y + '-' + m),
        y: String(y)
    }

    return today;
}


/**
 *
 *
 * @param {*} yearTagId 년도태그
 * @param {*} semTagId 학기태그
 */
this.gfn_dateInit = function (yearTagId, semTagId, fall_semester) {
    var date = new Date();
    var month = date.getMonth() + 1;
    var year = month > 2 ? date.getFullYear() : date.getFullYear() - 1;
    date.setFullYear(year);
    if (month <= 2 || month >= 9) {
        $('#' + semTagId).val(fall_semester);
        $('#' + semTagId).attr('reset_value', fall_semester);
    }
    gfn_datepickerInit(yearTagId, 'Y', year.toString());
}

/**
 *
 * 지정한 년월의 이전달 년월을 return 하는 함수
 * @param {*} baseMonth 지정한 년월 'yyyymm'
 * @param {*} diffMonth 지정한 년월에서 뺄 월 | Number
 */
this.gfn_getPrevMonth = function (baseMonth, diffMonth) {
    baseMonth = makePureStr(baseMonth);
    var month = baseMonth.slice(0, 4) + '-' + baseMonth.slice(4, 6);
    var m = new Date(month);
    m.setMonth(m.getMonth() - diffMonth);

    var ym = new Date(m).getYM();

    return ym;
}

/**
 *
 * 인자로 받은 년월을 밀리초로 return 하는 함수 (날짜를 비교할 때 사용)
 * @param {*} yearMonth 지정한 년월 'yyyymm'
 */
this.gfn_ymToTime = function (yearMonth) {
    var ym = yearMonth.slice(0, 4) + '-' + yearMonth.slice(4, 6);
    return new Date(ym).getTime();
}

/**
 *
 * 인자로 받은 년월일을 밀리초로 return 하는 함수 (날짜를 비교할 때 사용)
 * @param {*} yearMonthDate 지정한 년월 'yyyymmdd'
 */
this.gfn_ymdToTime = function (yearMonthDate) {
    var ymd = yearMonthDate.slice(0, 4) + '-' + yearMonthDate.slice(4, 6) + '-' + yearMonthDate.slice(6, 8);
    return new Date(ymd).getTime();
}


/**
 *
 * 지정한 날짜의 이전달 첫번째 날과 마지막날을 배열로 return 하는 함수
 * @param {*} baseDate 지정한 날짜 'yyyy-mm-dd'
 * @param {*} diffMonth 지정한 날짜에서 뺄 월 | Number
 */
this.gfn_get_prevMonthDate = function (baseDate, diffMonth) {
    var d = new Date(baseDate);
    d.setMonth(d.getMonth() - diffMonth);
    var ymd = new Date(d).getYMD().split('-');
    var firstDay = '01';
    var lastDay = new Date(d).getLastDay();

    var y = ymd[0];
    var m = ymd[1];

    if (lastDay < 10) {
        lastDay = "0" + lastDay;
    }

    return [y + '-' + m + '-' + firstDay, y + '-' + m + '-' + lastDay];
}
