var CALENDAR_DAY_INFO ={
    year: "",
    month: "",
    day: ""
};

var ZELLER_DAY = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
var ZELLER_MONTH = [13, 14, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var IS_CALENDAR_EXTEND = false;
var DAY_LIST = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

this.gfn_calendarInit = function(calBodyId,textId,decBtnId,incBtnId){
    initDayInfo();
    initMonthcalendar(calBodyId,textId,decBtnId,incBtnId);
    setUpBtns(calBodyId,textId,decBtnId,incBtnId);
}

/**
 * 날짜 상수를 초기화 하는 함수
 *
 */
function initDayInfo() {
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth(); // getMonth() returns month from 0-11 not 1-12.
    var year = d.getFullYear();
    CALENDAR_DAY_INFO["year"] = year;
    CALENDAR_DAY_INFO["month"] = month;
    CALENDAR_DAY_INFO["day"] = date;
}

/**
 *
 *
 * @param {*} calId 달력이될 테이블 태그의 아이디
 */
function initMonthcalendar(calId,textId,decBtnId,incBtnId){
    CALENDAR_DAY_INFO["day"] = 1;
    var calendarBody = document.getElementById(calId);
    calendarBody.innerHTML = "";
    // month증가 감소 버튼 달아야함
    for (var index = 0; index < 5; index++) {
        tr = document.createElement("tr");
        for (var idx = 0; idx < 7; idx++) {
            td = document.createElement("td");
            tr.appendChild(td);
        }
        calendarBody.appendChild(tr);
    }
    drawMonthcalendar(calendarBody);
    setDateText(textId);
}


function drawMonthcalendar(calendarBody) {
    firstDay = getDayOfWeek(1); //첫날이 무슨요일인지 구함
    var monthStart = DAY_LIST.indexOf(firstDay); //한달의 시작이 무슨요일인지 알게됨 
    var month = CALENDAR_DAY_INFO["month"];
  
    var thisMonthDays = getMonthDays(month);
    var lastMonthDays = getMonthDays(month - 1);
    calendarExtend(thisMonthDays, monthStart,calendarBody);
    var calendarCells = document.querySelectorAll(".calendar-body td");
  
    for (var index = 0; index < calendarCells.length; index++) {
      calendarCells[index].setAttribute('id','');
      var p = document.createElement("p");
      calendarCells[index].innerHTML = "";
      if (index < monthStart) {
        p.classList.add("text-gray");
        p.textContent = lastMonthDays - (monthStart - index) + 1;
        calendarCells[index].appendChild(p);
      } 
      else if (monthStart + thisMonthDays <= index) {
        p.classList.add("text-gray");
        p.textContent = index - (monthStart + thisMonthDays) + 1;
        calendarCells[index].appendChild(p);
      } 
      else {
        p.classList.add("text-black");
        p.textContent = index - monthStart + 1;
        calendarCells[index].appendChild(p);
        var monthText = month>8 ? month+1:'0'+(month+1);
        var dayText = (index-monthStart+1)>9 ? (index-monthStart+1):'0'+(index - monthStart + 1);
        calendarCells[index].setAttribute(
          "id",
          CALENDAR_DAY_INFO["year"].toString() + monthText.toString() + dayText.toString()
        );
        // calendarCells[index].addEventListener("click", cellClicked);
      }
    }
  }


function setDateText(textId) {
    var dateText = document.getElementById(textId);
    var month = CALENDAR_DAY_INFO["month"] + 1>9 ? CALENDAR_DAY_INFO["month"] + 1 :'0'+(CALENDAR_DAY_INFO["month"] + 1); 
    dateText.innerHTML = CALENDAR_DAY_INFO["year"] + "-" + month;
    $('#'+textId).trigger('change');
}


  
/**
 *
 *
 * @param {*} d day 오늘이 몇일인지 인자로 전달
 * @returns 오늘이 무슨요일인지 반환
 */
function getDayOfWeek(d) {
    var year;
    var month = CALENDAR_DAY_INFO["month"];
    var day = d;

    // Zeller's congurence rule
    if (month < 2) {
        year = CALENDAR_DAY_INFO["year"] - 1;
    } 
    else {
        year = CALENDAR_DAY_INFO["year"];
    }

    var K = parseInt(year % 100);
    var J = parseInt(year / 100);
  
    // ZELLER's congruence
    result =
      day +
      parseInt((13 * (ZELLER_MONTH[month] + 1)) / 5) +
      K +
      parseInt(K / 4) +
      parseInt(J / 4) +
      5 * J;
    result = result % 7;
    return ZELLER_DAY[result];
}

/**
 *
 *
 * @param {*} month 월
 * @returns 해당월이 몇일까지인지 반환 
 */
function getMonthDays(month) {
    var year = CALENDAR_DAY_INFO["year"];
    if (month == 1) {
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            return 29;
        } 
        else {
            return 28;
        }
    } 
    else if (month == -1) {
        return 31;
    } 
    else {
        return MONTH_DAYS[month];
    }
}

/**
 *
 *
 * @param {*} thisMonthDays
 * @param {*} monthStart
 * @param {*} calendarBody
 * @returns
 */
function calendarExtend(thisMonthDays, monthStart,calendarBody) {
    if ( thisMonthDays - (7 - monthStart) - 28 > 0 && IS_CALENDAR_EXTEND == false ) {
      IS_CALENDAR_EXTEND = true;
      if (calendarBody.childNodes.length == 6) {
        return;
      }
      tr = document.createElement("tr");
      for (var index = 0; index < 7; index++) {
        tr.appendChild(document.createElement("td"));
      }
      calendarBody.appendChild(tr);
    } 
    else if ( thisMonthDays - (7 - monthStart) - 28 < 0 && IS_CALENDAR_EXTEND == true) {
      IS_CALENDAR_EXTEND = false;
      if (calendarBody.childNodes.length == 5) {
        return;
      }
      calendarBody.removeChild(calendarBody.lastChild);
    }
}

function setUpBtns(calBodyId,textId,decBtnId,incBtnId){
    var incButton = document.getElementById(incBtnId); 
    var decButton = document.getElementById(decBtnId); 
    incButton.addEventListener("click", function() {
        var calendarBody = document.getElementById(calBodyId);
        var year = CALENDAR_DAY_INFO["year"];
        var month = CALENDAR_DAY_INFO["month"];
        var nextMonth;
        var nextYear;
        if (month == 11) {
          nextMonth = 0;
          nextYear = year + 1;
          CALENDAR_DAY_INFO["year"] = nextYear;
        } else {
          nextMonth = month + 1;
        }
        CALENDAR_DAY_INFO["month"] = nextMonth;
      
        drawMonthcalendar(calendarBody);
        setDateText(textId);
    });

    decButton.addEventListener("click",function(){
        var calendarBody = document.getElementById(calBodyId);
        var year = CALENDAR_DAY_INFO["year"];
        var month = CALENDAR_DAY_INFO["month"];
        var nextMonth;
        var nextYear;
        if (month == 0) {
          nextMonth = 11;
          nextYear = year - 1;
          CALENDAR_DAY_INFO["year"] = nextYear;
        } else {
          nextMonth = month - 1;
        }
        CALENDAR_DAY_INFO["month"] = nextMonth;
        drawMonthcalendar(calendarBody);
        setDateText(textId);
    });

}