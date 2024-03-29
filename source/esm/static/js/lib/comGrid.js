/* ************************************************************************************************
# 프로젝트      : 전자식 복무관리 시스템
# 프로그램 ID   : comGrid.js
# 프로그램 Name : 그리드 공통 함수
# -------------------------------------------------------------------------------------------------
# 버전          변경일자         생성자       변경내용
# -------------------------------------------------------------------------------------------------
# v1.0          2020-02-01       송영진       최초작성
************************************************************************************************ */

/** 
 * 함 수 명 : gfnGridInit
 * 설    명 : 그리드 초기화
 * 리턴형식 : N/A
 * 매개변수 
 * @param {*} columns 그리드 각 컬럼 설정을 위한 기준 데이터(배열)
 * @param {*} options 그리드 설정을 위한 변수
**/
$.fn.gfnGridInit = function (columns, options) {

  
  
  // 그리드 width, height 지정
  this.css({
    width: options.width || '100%',
    height: options.height || '100%'
  });

  this.gridView = new RealGridJS.GridView(this.attr("id")); // GridView 객체
  this.provider = new RealGridJS.LocalDataProvider(); // LocalDataProvider 객체
  this.gridView.setDataSource(this.provider); // Grid와 Provider 연결

  // columns에 선언된 fieldName을 Provider의 fielid로 정의
  var fields = columns.map(function (item) {
    return {fieldName: item.fieldName};
  });
  this.provider.setFields(fields);

  this.provider.setOptions({
    softDeleting: true
  });

  // 기본 0건으로 초기화
  this.closest('.grid').find('.grid-title__cnt').text("(0건)");

  // 그리드 컬럼별 속성 설정
  initGridField(this, columns);
  this.gridView.setColumns(columns);
  
  //스타일 초기화
  initGridStyle(this);

  //옵션 초기화
  initGridOption(this.gridView);
  
  // 컬럼 고정 : 왼쪽
  if (options.leftFixedCol > 0) {
    this.gridView.setFixedOptions({ colCount: options.leftFixedCol, colBarWidth: 0 });  
  }
  // 컬럼 고정 : 오른쪽
  if (options.rightFixedCol > 0) {
    this.gridView.setFixedOptions({ rightColCount: options.rightFixedCol, colBarWidth: 0 });
  }  
 
  // 그리드 필수항목 오류 메시지를 모달 팝업에 출력
  this.gridView.onValidationFail = function (gridView, itemIndex, column, err) {
    // console.log('onValidationFail')
    var errorMessage = err.message;
    gfnShowErrorModal(errorMessage);
  }
  
  // 그리드 필수 항목체크 및 리얼그리드 오류 메시지 발생
  this.gridView.onValidateRow = function(gridView, itemIndex, dataRow, inserting, values) {     
    var columns = gridView.getColumns();
    for (var i = 0; i < columns.length; i++) {
      var columnInfo = columns[i];
      // 필수 체크
      if (columnInfo.header.subText) {
        var value = values[columnInfo.name];
        if ((!value || !value.trim()) && value !== 0) {
          var headerText = columnInfo.header.text;
          var error = {
            level: RealGridJS.ValidationLevel.ERROR,
            message: headerText + '은(는) 필수입력 값 입니다.'
          };
          return error;
        }
      }
    }
    return true;
  }

  // 엔터키, 탭 입력 시 다음 줄 첫번째 컬럼으로 커서 옮기기
  this.gridView.onKeyDown = function (gridView, key, ctrl, shift, alt) {
    // key === 13(엔터), key === 9(Tab)키     
    if (key === 999) {
      var currentCell = gridView.getCurrent();
      var columns = gridView.getColumns();

      // dataIndex 순으로 정렬
      columns.sort(function (a, b) {
        return a.dataIndex - b.dataIndex;
      });

      // 첫번째 컬럼
      var firstFieldName = columns[0].fieldName;

      gridView.setCurrent({
        fieldName: firstFieldName,
        dataRow: currentCell.dataRow + 1,
      });
      gridView.setFocus();
      return false;
    }
  };
  return this;
};


/** 
 * 함 수 명 : initGridField
 * 설    명 : 그리드 컬럼에 대한 속성 초기화
 * 리턴형식 : N/A
 * 매개변수 
 * @param {*} grdObj 그리드 객체
 * @param {*} columns 그리드 각 컬럼 설정을 위한 기준 데이터(배열)
**/
function initGridField(grdObj, columns) {
  for (var i = 0; i < columns.length; i++) {
    var columnInfo = columns[i];
    // GridView의 name이 없을 경우 fieldName의 값을 넣음
    if (!columnInfo.name) {
      columnInfo.name = columnInfo.fieldName;
    }

    // header객체 초기화
    columnInfo.header = columnInfo.header || {};

    // styles객체 초기화
    columnInfo.styles = columnInfo.styles || {};

    // editor객체 초기화
    columnInfo.editor = columnInfo.editor || {};

    // 그리드 헤더 객체에 text값 넣기
    if (columnInfo.text) {
      columnInfo.header.text = columnInfo.text;
    }

    // 그리드 헤더 필수 컬럼 정의
    // 필수 항목은 *표시하며 css 설정
    if (columnInfo.essential === true) {
      columnInfo.header.subText = "*";
      columnInfo.header.subTextGap = 5;
      columnInfo.header.subTextLocation = "left";
      columnInfo.header.subStyles = {
        foreground: "#e74c3c",
        fontSize: 18,
        selectedForeground: "#e74c3d",
        fontFamily: 'Noto Sans KR'
      };
    }

    
    

    // 컬럼유형에 따른 오브젝트 설정
    if (columnInfo.type) {
      switch (columnInfo.type) {
        case "combo": // 콤보박스
          columnInfo.editor = {
            type: 'dropDown',
            domainOnly: true,
            textReadOnly: true,
            dropDownWhenClick: true,
            values: columnInfo.comboList.map(function (item) { return item.code }),
            labels: columnInfo.comboList.map(function (item) { return item.name }),
          };
          break;
        case "number": // 숫자
          columnInfo.editor = {};
          columnInfo.editor = {
            "type" : "number",
            "textAlignment": "far",
            "editFormat": "#,##0",
            "multipleChar": "+",
          };
          columnInfo.styles = {};
          columnInfo.styles = {
            "textAlignment": "far",
            "numberFormat": "#,##0",
          };
          columnInfo.displayRegExp = /\B(?=(\d{3})+(?!\d))/g;
          columnInfo.displayReplace = ",";
          break;
        case "search": // 조회버튼
          columnInfo.buttonVisibility = "always";
          columnInfo.button = "image";
          columnInfo.imageButtons = {
            width: 20,
            images: [
              {
                cursor: "pointer",
                up: "/comm/faimg/002/16", //'<i class="fas fa-search"></i>'
              },
            ],
          };
          break;
        case "email": // 이메일버튼
          columnInfo.buttonVisibility = "always";
          columnInfo.button = "image";
          columnInfo.imageButtons = {
            width: 20,
            images: [
              {
                cursor: "pointer",
                up: "/comm/faimg/003/16", //'<i class="fas fa-search"></i>'
              },
            ],
          };
          break;
        case "button": // 버튼
          columnInfo.editable = false;
          columnInfo.renderer = {
            type: "imageButton",
            text: arr[0],
            hoveredUnderline: false,
            imageUrl: "/comm/faimg/068/90/64,133,238",
            cursor: "pointer",
          };
          columnInfo.styles = {
            textAlignment: "center",
            lineAlignment: "center",
            foreground: "#fff",
          };
          break;
        case "date": // 날짜
          columnInfo.editButtonVisibility = "always";
          columnInfo.editor = {
            type: "btdate",
            btOptions: {
              language: 'kr',
            },
            datetimeFormat: "yyyyMMdd",
            commitOnSelect: true,
            mask: {
              editMask: "9999-99-99",
            },
          };

          columnInfo.styles = {
            datetimeFormat: "yyyy-MM-dd",
          };

          columnInfo.displayRegExp = /(\d{4})(\d{2})(\d{2})/;
          columnInfo.displayReplace = "$1-$2-$3";

          if (columnInfo.format == "YYYYMM") {
            columnInfo.editor.btOptions.minViewMode = 1;
            columnInfo.editor.datetimeFormat = "yyyyMM";
            columnInfo.editor.mask = {
              editMask: "9999-99",
              includedFormat: false,
            };
            columnInfo.displayRegExp = /(\d{4})(\d{2})/;
            columnInfo.displayReplace = "$1-$2";
          } else if (columnInfo.format == "YYYY") {
            columnInfo.editor.btOptions.minViewMode = 2;
            columnInfo.editor.datetimeFormat = "yyyy";
            columnInfo.editor.mask = {
              editMask: "9999",
              includedFormat: false,
            };
            columnInfo.displayRegExp = /(\d{4})/;
            columnInfo.displayReplace = "$1";
          } else if (columnInfo.format == "DATETIME") {
            columnInfo.editor.datetimeFormat = "yyyyMMddhhmmss";
            columnInfo.editor.mask = {
              editMask: "9999-99-99 99:99:99",
              includedFormat: false,
            };
            columnInfo.displayRegExp = /(\d{4}).*?(\d{2}).*?(\d{2}).*?(\d{2}).*?(\d{2}).*?(\d{2}).*/;
            columnInfo.displayReplace = "$1-$2-$3 $4:$5:$6";
          }
          break;
        case "link": // 링크
          columnInfo.renderer = {
            type: "link",
            url: gubun2 + ediname,
            showUrl: false,
            cursor: "pointer",
          };
          columnInfo.styles = {
            foreground: "#0984e3",
          };
          break;
        case "M": // M
          columnInfo.displayRegExp = /(\d)(?=(?:\d{3})+(?!\d))/g;
          columnInfo.displayReplace = "$1,";
          gfn_setDataType(grdObj, fvalArr[i], "number");
          break;
        case "F": // F
          columnInfo.buttonVisibility = "always";
          columnInfo.button = "image";
          columnInfo.imageButtons = {
            width: 20,
            images: [
              {
                cursor: "pointer",
                up: "/comm/faimg/56d/16", //'<i class="fas fa-search"></i>'
              },
            ],
          };
          break;
        case "time": // 시간
          columnInfo.editor = {};
          columnInfo.editor.type = "text";
          columnInfo.editor.mask = "00:00";
          columnInfo.displayRegExp = "([0-9]{2})([0-9]{2})";
          columnInfo.displayReplace = "$1:$2";
          break;
        case "y": // y
          columnInfo.renderer = {
            type: "check",
            shape: "box",
            falseValues: "N",
            trueValues: "Y",
            editable: true,
            startEditOnClick: true,
          };
          columnInfo.styles = {
            figureSize: "160%",
          };
          break;
        case "HP": // 핸드폰번호
          columnInfo.editor = {};
          columnInfo.editor.type = "text";
          columnInfo.displayRegExp = "([0-9]{3})([0-9]{4})([0-9]{4,})";
          columnInfo.displayReplace = "$1-$2-$3";
          break;
      }

      // 컬럼의 텍스트 정렬
      // near: Left정렬
      // center: Center정렬
      // far: Right 정렬
      if (columnInfo.align) {
        columnInfo.styles.textAlignment = columnInfo.align;
        columnInfo.editor.textAlignment = columnInfo.align;
      }

      

    }

    // 수정불가(editable : false) 스타일 설정
    if(columnInfo.editable === false) {

        
      columnInfo.styles = {
        textAlignment: "center",
        lineAlignment: "center",
        foreground: "#000",
        background: "#b4b4b4"
      };

    }

    
    /*
    C: 콤보박스
    I: contentFit: auto,
    P: 검색팝업 돋보기 우측
    K: 이메일 아이콘 우측
    B: 
    */
  }
}


/** 
 * 함 수 명 : initGridStyle
 * 설    명 : 그리드 CSS  스타일 정의
 * 리턴형식 : N/A
 * 매개변수 
 * @param {*} grdObj 그리드 객체
**/
function initGridStyle($grid) {
  var gridView = $grid.gridView;

  //  그리드 스타일 설정
  gridView.setStyles({
    // 그리드 전체 스타일
    grid: {
      fontSize: "12",
      paddingTop: "15",
      paddingBottom: "15",
      border: "#00ffffff, 1",
      selectedBackground: "rgba(11,186,130,1)"
    },

    // 그리드 바디 스타일
    body: {
      paddingTop: "15",
      paddingBottom: "15",
      foreground: "#ff4b5a61",
      line: "#00ffffff, 1px",
      empty: {
      },
    },

    // 그리드 헤더 스타일
    header: {
      borderRight: "#d5d5d5, 1",
      borderBottom: "#d5d5d5, 1",
      background: "#e6f2fd",
      paddingTop: "10",
      paddingBottom: "10",
      figureInactiveBackground: "#e74c3c",
      figureBackground : "#e74c3c",

      // 그리드 헤더 글자 굵게
      // "fontBold": true,
      // "height": 200,
      // "foreground": "#4b5a61",

      selectedBackground: "#e6f2fd",
      selectedForeground: "#000000",
      "subStyles ": {
        foreground: "#e74c3c",
        fontSize: 18,
        selectedForeground: "#e74c3c",
      },

      // 그리드 헤더 그룹 스타일
      group: {
        background: "#fffcfa",
        paddingTop: "12",
        paddingBottom: "12",
        // "fontBold": true,

        borderRight: "#d5d5d5, 1",
        borderBottom: "#d5d5d5, 1",
        // "borderTop": "#1f8ecd, 2"
      },      
    },
    
    // 그리드 바디 선택행 색상 및 박스라인 스타일    
    selection: {
      background: "rgba(11,186,130,0.2)",
      border: "#330bbaff,1px",
    },

    // 그리드 풋터 스타일
    footer: {
      background: "#fafad2",
      paddingTop: "5",
      paddingBottom: "5",
      textAlignment: "center",

      borderRight: "#00ffffff, 1",
      borderBottom: "#d5d5d5, 1",
      borderTop: "#d5d5d5, 1",
      borderLeft: "#d5d5d5, 1",
    },

    // 그리드 인디케이터 스타일
    // 그리드 컬럼 중 자동번호 색상 정의 
    indicator: {
      background: "#ffffff",
      fontBold: false,
      borderRight: "#d5d5d5, 1",
      borderBottom: "#d5d5d5, 1",
      foot: {
        borderLeft: "#00ffffff, 1",
      },
    },

    // 그리드 인디케이터 스타일
    // 체크박스 색상 정의
    checkBar: {
      borderRight: "#d5d5d5, 1",
      borderBottom: "#d5d5d5, 1",
      figureBackground:'#EF6461',
    },

    // 그리드 인디케이터 스타일
    // 입력/수정/삭제 상태변경 색상 정의
    stateBar: {
      borderRight: "#d5d5d5, 1",
      borderBottom: "#d5d5d5, 1",
      foreground: "#e74c3c",
      selectedForeground: "#e74c3c",
      figureInactiveBackground: "#e74c3c",
      figureBackground : "#e74c3c",
    },

    // 고정컬럼 정의 스타일
    fixed: {
      background: "#ffffff",
      foreground: "#ff4b5a61",
      borderleft: "#d5d5d5, 1",
      borderRight: "#d5d5d5, 1",
      borderBottom: "#d5d5d5, 1",
    },
  });  

  $grid.each(function () {
    $(this).css({
      // "border-right": "solid #ffffff 3px"
    });
  });

  $grid.find('div').each(function () {
    $(this).css({
      // 그리드 상단 및 하단 라인 색성 지정
      "border-top": "solid #2a9d8f 0.0rem",
      "border-bottom": "solid #2a9d8f 0.0rem", 
    });
  });

  // 필터에 CSS 스타일 적용 여부 설정
  gridView.setFilteringOptions({ selector: { useCssStyle: true } });

  // 그리드 바디 라인 간격 조정
  gridView.setDisplayOptions({ useCssStyleProgress: true, rowHeight: 30, drawBorderRight: false});

  // 그리드 바디 패딩 설정
  // gridView.setStyles({body:{paddingLeft:10}});

  // 그리드 행추가시 스타일
  gridView.addCellStyle(
    "found",
    {
      background: "#cc880000",
      foreground: "#ffffff",
    },
    true
  );


}



function initGridOption(gridView) {
  // 그리드 옵션 설정
  gridView.setSelectOptions({ style: "singleRow" }); //rows, columns, singleRow, singleColumn, none, block

  // 그리드 패널 설정
  gridView.setPanel({
    visible: false,
  });

  // 그리드 인디케이터 헤더 컬럼명 설정
  gridView.setIndicator({
    headText: "No",
  });

  // 그리드 상태바 설정
  // gridView.setStateBar({
  //   visible: false
  // });

  //그리드 체크박스 설정
  gridView.setCheckBar({
    visible: true,
  });

  // 그리드 오브젝트 설정
  gridView.setCopyOptions({
    singleMode: true,
    lookupDisplay: true,
    copyDisplayText: true,
    checkReadOnly: true,
  });

  gridView.setEditorOptions({
    useCssStyle: true, //모든 에디터에 CSS를 적용할 경우 사용
    useCssStyleDropDownList: true, //dropDown
    useCssStyleDatePicker: true, //달력
    useCssStylePopupMenu: true, //popupMenu
    useCssStyleMultiCheck: true, //multiCheck
  });

  gridView.setEditOptions({
    insertable: false,
    appendable: false,
    editWhenFocused: true,
    enterToTab: true,
  });

  gridView.setOptions({
    edit: { insertable: false, appendable: false, deletable: false },
    footer: { visible: false },
  });

  gridView.setDisplayOptions({
    fitStyle: "even",
    drawBorderRight: false,
    focusColor:"#2196F3"
  });
}

/**
 *
 *
 * @param {*} grd 그리드 객체
 * @param {*} fName 데이터 타입을 변경 하려는 필드 이름
 * @param {*} type  변경하려는 데이터 타입
 */
function gfn_setDataType(grd, fName, type) {
  var fields = grd.provider.getFields(); //대문자
  var f_arr = fName.split(",");

  for (var i = 0; i < f_arr.length; i++) {
    var field = f_arr[i];
    for (var index = 0; index < fields.length; index++) {
      fields[index].fieldName = fields[index].fieldName.toLowerCase(); //소문자
      if (fields[index].fieldName === field.toLowerCase()) {
        fields[index].dataType = type;
      }
    }
  }

  grd.provider.setFields(fields);
}

/**
 *
 *
 * @param {*} grd grid 변수 전달
 * @param {*} sumTextColoumn  text,ColoumnName => 스트링으로 전달
 * @param {*} sumNumberColoumns 합계로 표시할 컬럼 필드명들
 */
this.gtn_setGridSumFooter = function (grd, sumTextColoumn, sumNumberColoumns) {
  grd.grid.setIndicator({ footText: " " });
  grd.grid.setOptions({
    footer: { visible: true },
  });
  grd.grid.setOptions({ summaryMode: "aggregate" });
  if (!gfnIsNull(sumTextColoumn)) {
    var t = sumTextColoumn.split(",");
    var col = grd.grid.columnByName(t[1]);
    col.footer = {};
    col.footer.text = t[0];
    grd.grid.setColumn(col);
  }

  var cArr = sumNumberColoumns.split(",");
  for (var index = 0; index < cArr.length; index++) {
    gfn_setDataType(grd, cArr[index], "number");
    var c = grd.grid.columnByName(cArr[index]);
    c.type = "data";
    c.footer = { expression: "sum" };
    c.footer.styles = {
      textAlignment: "far",
      numberFormat: "#,###",
    };
    grd.grid.setColumn(c);
  }
};

this.gfn_setGridMultiFooter = function (grd, footerCount, footerHeight, sumTextColoumnArr, sumNumberColoumnsArr) {
  grd.grid.setOptions({
    footer: { visible: true },
  });
  grd.grid.setFooter({
    count: footerCount,
    height: footerHeight,
  });
  grd.grid.setOptions({ summaryMode: "aggregate" });
  for (var index = 0; index < sumTextColoumnArr.length; index++) {
    var sumTextColoumn = sumTextColoumnArr[index];
    if (!gfnIsNull(sumTextColoumn)) {
      var t = sumTextColoumn.split(",");
      var col = grd.grid.columnByName(t[1]);
      if (gfnIsNull(col.footer.text)) {
        col.footer = {};
        col.footer.text = [t[0]];
      } else {
        col.footer.text.push(t[0]);
      }
      grd.grid.setColumn(col);
    }
  }
  for (var index = 0; index < sumNumberColoumnsArr.length; index++) {
    var cArr = sumNumberColoumnsArr[index].split(",");
    for (var index = 0; index < cArr.length; index++) {
      gfn_setDataType(grd, cArr[index], "number");
      var c = grd.grid.columnByName(cArr[index]);
      c.type = "data";
      c.footer = { expression: "sum" };
      c.footer.styles = {
        textAlignment: "far",
        numberFormat: "#,###",
      };
      grd.grid.setColumn(c);
    }
  }
};

/**
 * 더하고자 하는 컬럼명을 넘겨 total값을 return 해준다.
 * @param {*} _grd grid 변수
 * @param {*} sumColumns 더하고자 하는 컬럼 필드명 | string
 * @param {*} itemIndex realgrid onCellEdited 함수의 인자를 그대로 넘긴다.
 * @param {*} field realgrid onCellEdited 함수의 인자를 그대로 넘긴다.
 */
function gfn_setGridSum(_grd, sumColumns, itemIndex, field) {
  var sumArr = sumColumns.replace(/[\t\s]/g, "").split(",");
  var toLowerArr = sumArr;
  var getField = _grd.provider.getFields();

  var total = 0;
  for (var i = 0; i < sumArr.length; i++) {
    var sumData = parseFloat(_grd.grid.getValue(itemIndex, sumArr[i]));
    if (isNaN(sumData)) sumData = 0; // 빈 셀은 0으로 처리
    total += sumData;

    toLowerArr[i] = sumArr[i].toLowerCase(); // getFields와 fieldName 맞추려고
  }

  // 현재 수정한 필드가 인자로 받은 필드에 속해있지 않으면 return
  // if (toLowerArr.indexOf(getField[field].fieldName.toLowerCase()) < 0) {
  //   return false;
  // }

  return total;
}

/**
 * 특정 column 에 대해 데이터가 없는 (e.g, NULL) row 의 갯수를 리턴
 * @param {*} grd grid 변수
 * @param {*} columnName null 을 찾을 컬럼 명
 */
function gfn_getColumnNonNullCount(grd, columnName) {
  var rowCount = grd.grid.getItemCount();
  var count = 0;

  if (rowCount <= 0 || isNaN(rowCount)) {
    return 0;
  }

  for (var idx = 0; idx < rowCount; idx++) {
    if (gfnIsNull(grd.grid.getValue(idx, columnName)) == false) {
      count += 1;
    }
  }

  return count;
}

/**
 * footer 병합하는 함수
 * @param {*} _grd grid 변수
 * @param {*} count 맨 앞 컬럼부터 합칠 컬럼의 수
 * @param {*} start 병합을 시작할 컬럼의 인덱스
 */
function gfn_mergeFooter(_grd, count, start) {
  if (gfnIsNull(start)) start = 0;
  var fields = _grd.provider.getFields();
  var mergeArr = [];
  // console.log(fields);

  for (var i = start; i < count + start; i++) {
    mergeArr.push(fields[i].orgFieldName);
  }

  _grd.grid.setFooter({
    mergeCells: mergeArr,
  });
}

/**
 *
 *
 * @param {*} grid grd object
 * @param {string} columns validation 할 컬럼들 ,로 구분
 * @param {string} options validataion option
 *
 *
 * 참고 url
 * http://help.realgrid.com/api/features/Expression/
 * http://help.realgrid.com/api/GridBase/setValidations/
 * http://demo.realgrid.com/Validation/ColumnValidation/
 */
this.gfn_setGridVaildate = function (grd, columns, option, args) {
  var colArr = columns.split(",");
  // for (let i = 0; i < colArr.length; i++) {
  //   colArr[i] = colArr[i].trim();
  // }

  if (option == "notEmpty") {
    for (var i = 0; i < colArr.length; i++) {
      var col = grd.grid.columnByName(colArr[i]);
      if (grd[colArr[i]] == null || grd[colArr[i]] == undefined) {
        grd[colArr[i]] = {};
        grd[colArr[i]].myValidation = [];
      }
      if (grd[colArr[i]].myValidation == null || grd[colArr[i]].myValidation == undefined) {
        grd[colArr[i]].myValidation = [];
      }
      var validation = grd[colArr[i]].myValidation;
      var v = {
        criteria: "value is not empty",
        message: col.header.text + ld.necessary_input,
        mode: "always",
        level: "error",
      };
      validation.push(v);
      col.validations = validation;
      grd[colArr[i]].myValidation = validation;
      grd.grid.setColumn(col);
    }
  } else if (option == "timeNull") {
    for (var i = 0; i < colArr.length; i++) {
      var col = grd.grid.columnByName(colArr[i]);
      if (grd[colArr[i]] == null || grd[colArr[i]] == undefined) {
        grd[colArr[i]] = {};
        grd[colArr[i]].myValidation = [];
      }
      if (grd[colArr[i]].myValidation == null || grd[colArr[i]].myValidation == undefined) {
        grd[colArr[i]].myValidation = [];
      }
      var validation = grd[colArr[i]].myValidation;
      var v = {
        criteria: "(value < 2400) or (value is empty) or (value is null) or (value is not defined) or (value is nan)",
        message: col.header.text + ld.hourBig,
        mode: "always",
        level: "error",
      };
      validation.push(v);

      v = {
        criteria: "((value mod 100) < 60) or (value is empty) or (value is null) or (value is not defined) or (value is nan)",
        message: col.header.text + ld.timeBig,
        mode: "always",
        level: "error",
      };
      validation.push(v);

      col.validations = validation;
      grd[colArr[i]].myValidation = validation;
      grd.grid.setColumn(col);
    }
  } else if (option == "timeNotNull") {
    for (var i = 0; i < colArr.length; i++) {
      var col = grd.grid.columnByName(colArr[i]);
      if (grd[colArr[i]] == null || grd[colArr[i]] == undefined) {
        grd[colArr[i]] = {};
        grd[colArr[i]].myValidation = [];
      }

      if (grd[colArr[i]].myValidation == null || grd[colArr[i]].myValidation == undefined) {
        grd[colArr[i]].myValidation = [];
      }
      var validation = grd[colArr[i]].myValidation;
      var v = {
        criteria: "(value < 2400)",
        message: col.header.text + ld.hourBig,
        mode: "always",
        level: "error",
      };
      validation.push(v);

      v = {
        criteria: "((value mod 100) < 60)",
        message: col.header.text + ld.timeBig,
        mode: "always",
        level: "error",
      };
      validation.push(v);
      col.validations = validation;
      grd[colArr[i]].myValidation = validation;
      grd.grid.setColumn(col);
    }
  }

  // range Date  validation시에는 컬럼에 start 일자 컬럼 end 일자 컬럼을 두개주세요
  else if (option == "rangeDate") {
    var start_col = grd.grid.columnByName(colArr[0]);
    if (grd[colArr[0]] == null || grd[colArr[0]] == undefined) {
      grd[colArr[0]] = {};
      grd[colArr[0]].myValidation = [];
    }
    if (grd[colArr[0]].myValidation == null || grd[colArr[0]].myValidation == undefined) {
      grd[colArr[0]].myValidation = [];
    }
    var validation = grd[colArr[0]].myValidation;
    var v = {
      criteria: "(values['" + colArr[1] + "'] is empty) or ((value <= values['" + colArr[1] + "']) and (value is not empty) )",
      message: ld.start_not_big_end,
      mode: "always",
      level: "error",
    };
    validation.push(v);
    start_col.validations = validation;
    grd[colArr[0]].myValidations = validation;
    grd.grid.setColumn(start_col);
  }

  // range Date Time  validation시에는 컬럼에 start 일자, start 시각 ,end 일자 ,end 시각 4개를 주세요. ,로 구분
  else if (option == "rangeDateTime") {
    var start_time_col = grd.grid.columnByName(colArr[1]);
    if (grd[colArr[1]] == null || grd[colArr[1]] == undefined) {
      grd[colArr[1]] = {};
      grd[colArr[1]].myValidation = [];
    }
    if (grd[colArr[1]].myValidation == null || grd[colArr[1]].myValidation == undefined) {
      grd[colArr[1]].myValidation = [];
    }
    var validation = grd[colArr[1]].myValidation;
    var v = {
      criteria:
        "((values['" +
        colArr[0] +
        "'] = values['" +
        colArr[2] +
        "'] )  and  (values['" +
        colArr[1] +
        "'] < values['" +
        colArr[3] +
        "']))" +
        "or" +
        "(values['" +
        colArr[0] +
        "'] <> values['" +
        colArr[2] +
        "'])",
      // message:ld.start_not_big_end,
      message: ld.start_time_big_end_time,
      mode: "always",
      level: "error",
    };
    validation.push(v);
    start_time_col.validations = validation;
    grd[colArr[0]].myValidations = validation;
    grd.grid.setColumn(start_time_col);
  }
  // 평점 시작과 종료 컬럼항목에 시작컬럼,종료컬럼 순으로 넘겨주세요
  else if (option == "avgGradeStartEnd") {
    for (var i = 0; i < colArr.length; i++) {
      var col = grd.grid.columnByName(colArr[i]);
      if (grd[colArr[i]] == null || grd[colArr[i]] == undefined) {
        grd[colArr[i]] = {};
        grd[colArr[i]].myValidation = [];
      }
      if (grd[colArr[i]].myValidation == null || grd[colArr[i]].myValidation == undefined) {
        grd[colArr[i]].myValidation = [];
      }
      var validation = grd[colArr[i]].myValidation;
      var v = {
        criteria:
          "(num(values['" +
          colArr[0] +
          "']) <= num(9.99))" +
          "and (num(values['" +
          colArr[0] +
          "']) >= num(0.00))" +
          "and (num(values['" +
          colArr[1] +
          "']) <= num(9.99)) " +
          "and (num(values['" +
          colArr[1] +
          "']) >= num(0.00))" +
          "and (num(values['" +
          colArr[0] +
          "']) <= num(values['" +
          colArr[1] +
          "']))",
        message: ld.avg_validation,
        mode: "always",
        level: "error",
      };
      validation.push(v);
      col.validations = validation;
      grd[colArr[i]].myValidation = validation;
      grd.grid.setColumn(col);
    }
  }
  //0에서 100 사이의 크기를 가져야하는 백분율에 대한 발리데이션
  else if (option == "percentage") {
    for (var i = 0; i < colArr.length; i++) {
      var col = grd.grid.columnByName(colArr[i]);
      if (grd[colArr[i]] == null || grd[colArr[i]] == undefined) {
        grd[colArr[i]] = {};
        grd[colArr[i]].myValidation = [];
      }
      if (grd[colArr[i]].myValidation == null || grd[colArr[i]].myValidation == undefined) {
        grd[colArr[i]].myValidation = [];
      }

      var validation = grd[colArr[i]].myValidation;
      var v = {
        criteria: "(values['" + colArr[i] + "'] <= 100)" + "and (values['" + colArr[i] + "'] >= 0)",
        message: col.header.text + " " + ld.percentage_validation,
        mode: "always",
        level: "error",
      };
      validation.push(v);
      col.validations = validation;
      grd[colArr[i]].myValidation = validation;
      grd.grid.setColumn(col);
    }
  }

  //같은날에 시간만 범위 형식일 경우 컬럼을 시작시간,종료시간으로 전달
  else if (option == "rangeTime") {
    var start_time_col = grd.grid.columnByName(colArr[0]);
    if (grd[colArr[0]] == null || grd[colArr[0]] == undefined) {
      grd[colArr[0]] = {};
      grd[colArr[0]].myValidation = [];
    }
    if (grd[colArr[0]].myValidation == null || grd[colArr[1]].myValidation == undefined) {
      grd[colArr[0]].myValidation = [];
    }
    var validation = grd[colArr[0]].myValidation;
    var v = {
      criteria: "((values['" + colArr[0] + "'] <= values['" + colArr[1] + "'] )",
      // message:ld.start_not_big_end,
      message: ld.startTimeValidation,
      mode: "always",
      level: "error",
    };
    validation.push(v);
    start_time_col.validations = validation;
    grd[colArr[0]].myValidations = validation;
    grd.grid.setColumn(start_time_col);
  }
  //학점 최소 최대
  else if (option == "avgPoint") {
    for (var i = 0; i < colArr.length; i++) {
      var col = grd.grid.columnByName(colArr[i]);
      if (grd[colArr[i]] == null || grd[colArr[i]] == undefined) {
        grd[colArr[i]] = {};
        grd[colArr[i]].myValidation = [];
      }
      if (grd[colArr[i]].myValidation == null || grd[colArr[i]].myValidation == undefined) {
        grd[colArr[i]].myValidation = [];
      }
      var validation = grd[colArr[i]].myValidation;
      var v = {
        criteria: "(num(values['" + colArr[i] + "']) <= num(4.30))" + "and (num(values['" + colArr[i] + "']) >= num(0.00))",
        message: col.header.text + ld.avg_min_max_validation,
        mode: "always",
        level: "error",
      };
      validation.push(v);
      col.validations = validation;
      grd[colArr[i]].myValidation = validation;
      grd.grid.setColumn(col);
    }
  }
  //학점 start,end
  else if (option == "avgRangePoint") {
    for (var i = 0; i < colArr.length; i++) {
      var col = grd.grid.columnByName(colArr[i]);
      if (grd[colArr[i]] == null || grd[colArr[i]] == undefined) {
        grd[colArr[i]] = {};
        grd[colArr[i]].myValidation = [];
      }
      if (grd[colArr[i]].myValidation == null || grd[colArr[i]].myValidation == undefined) {
        grd[colArr[i]].myValidation = [];
      }
      var validation = grd[colArr[i]].myValidation;
      var v = {
        criteria:
          "(num(values['" +
          colArr[0] +
          "']) <= num(values['" +
          colArr[1] +
          "']))" +
          "or ((values['" +
          colArr[0] +
          "']) is empty) or ((values['" +
          colArr[1] +
          "'] )is empty) ",
        message: ld.avg_range_validation,
        mode: "always",
        level: "error",
      };
      validation.push(v);
      col.validations = validation;
      grd[colArr[i]].myValidation = validation;
      grd.grid.setColumn(col);
    }
  }

  //소득구간 0부터 8이하
  else if (option == "incomeLower8") {
    for (var i = 0; i < colArr.length; i++) {
      var col = grd.grid.columnByName(colArr[i]);
      if (grd[colArr[i]] == null || grd[colArr[i]] == undefined) {
        grd[colArr[i]] = {};
        grd[colArr[i]].myValidation = [];
      }
      if (grd[colArr[i]].myValidation == null || grd[colArr[i]].myValidation == undefined) {
        grd[colArr[i]].myValidation = [];
      }
      var validation = grd[colArr[i]].myValidation;
      var v = {
        criteria: "(num(values['" + colArr[i] + "']) <= 8)" + "and" + "(num(values['" + colArr[i] + "']) >= 0) ",
        message: ld.incomeLower8,
        mode: "always",
        level: "error",
      };
      validation.push(v);
      col.validations = validation;
      grd[colArr[i]].myValidation = validation;
      grd.grid.setColumn(col);
    }
  }

  // 과정구분에 따른 학기 제한 colarr= [과정구분,학기]
  else if (option == "semesterLimitByProcGubun") {
    var col = grd.grid.columnByName(colArr[1]);
    if (grd[colArr[1]] == null || grd[colArr[1]] == undefined) {
      grd[colArr[1]] = {};
      grd[colArr[1]].myValidation = [];
    }
    if (grd[colArr[1]].myValidation == null || grd[colArr[1]].myValidation == undefined) {
      grd[colArr[1]].myValidation = [];
    }
    var validation = grd[colArr[1]].myValidation;
    var v = {
      criteria:
        "(values['" +
        colArr[0] +
        "'] = empty) or" +
        "(((str(values['" +
        colArr[0] +
        "']) = '" +
        args["[학사과정]"] +
        "') or (str(values['" +
        colArr[0] +
        "']) = '" +
        args["[박사과정]"] +
        "')) and (num(values['" +
        colArr[1] +
        "']) >= 1) and (num(values['" +
        colArr[1] +
        "']) <= 8)) or" +
        "(((str(values['" +
        colArr[0] +
        "']) = '" +
        args["[석사과정]"] +
        "') or (str(values['" +
        colArr[0] +
        "']) = '" +
        args["[석박사통합과정]"] +
        "')) and (num(values['" +
        colArr[1] +
        "']) >= 1) and (num(values['" +
        colArr[1] +
        "']) <= 4)) or" +
        "((str(values['" +
        colArr[0] +
        "']) = '" +
        args["[석박사통합과정(박)]"] +
        "') and (num(values['" +
        colArr[1] +
        "']) >= 1) and (num(values['" +
        colArr[1] +
        "']) <= 10))",
      message: ld.semester_by_proc_validation_msg,
      mode: "always",
      level: "error",
    };
    validation.push(v);
    col.validations = validation;
    grd[colArr[1]].myValidation = validation;
    grd.grid.setColumn(col);
  } else if (option == "semesterLessThanEqual") {
    var col = grd.grid.columnByName(colArr[1]);
    if (grd[colArr[1]] == null || grd[colArr[1]] == undefined) {
      grd[colArr[1]] = {};
      grd[colArr[1]].myValidation = [];
    }
    if (grd[colArr[1]].myValidation == null || grd[colArr[1]].myValidation == undefined) {
      grd[colArr[1]].myValidation = [];
    }
    var validation = grd[colArr[1]].myValidation;
    var v = {
      criteria: "num(values['" + colArr[0] + "']) <= num(values['" + colArr[1] + "'])",
      message: ld.less_than_equal_message,
      mode: "always",
      level: "error",
    };
    validation.push(v);
    col.validations = validation;
    grd[colArr[1]].myValidation = validation;
    grd.grid.setColumn(col);
  }

  //otherColumn,targetColumn => otherColumn 의 값에 따라서 targetColumn의 필수여부 정해짐
  // arg로 target의 null이 가능한 값
  else if (option == "notEmptyByOtherColumn") {
    var col = grd.grid.columnByName(colArr[1]);
    if (grd[colArr[1]] == null || grd[colArr[1]] == undefined) {
      grd[colArr[1]] = {};
      grd[colArr[1]].myValidation = [];
    }
    if (grd[colArr[1]].myValidation == null || grd[colArr[1]].myValidation == undefined) {
      grd[colArr[1]].myValidation = [];
    }
    var validation = grd[colArr[1]].myValidation;
    var v = {
      criteria:
        "((str(values['" +
        colArr[0] +
        "']) = '" +
        args +
        "') and (values['" +
        colArr[1] +
        "'] is not empty)) or" +
        "(str(values['" +
        colArr[0] +
        "']) <> '" +
        args +
        "')",
      //   "(str(values['" + colArr[0] + "']) <> '" + args + "')",
      // criteria: "(str(values['" + colArr[0] + "']) = '" + args + "')",
      message: col.header.text + ld.necessary_input,
      mode: "always",
      level: "error",
    };
    validation.push(v);
    col.validations = validation;
    grd[colArr[1]].myValidation = validation;
    grd.grid.setColumn(col);
  } else if (option == "len50") {
    var col = grd.grid.columnByName(colArr[0]);
    if (grd[colArr[0]] == null || grd[colArr[0]] == undefined) {
      grd[colArr[0]] = {};
      grd[colArr[0]].myValidation = [];
    }
    if (grd[colArr[0]].myValidation == null || grd[colArr[0]].myValidation == undefined) {
      grd[colArr[0]].myValidation = [];
    }
    var validation = grd[colArr[0]].myValidation;
    var v = {
      criteria: "(len( values['" + colArr[0] + "']) ) <= 50)",
      message: col.header.text + " " + ld.len_50,
      mode: "always",
      level: "error",
    };
    validation.push(v);
    col.validations = validation;
    grd[colArr[0]].myValidation = validation;
    grd.grid.setColumn(col);
  } else if (option == "returmAmtlessThanEqual") {
    var col = grd.grid.columnByName(colArr[0]);
    if (grd[colArr[0]] == null || grd[colArr[0]] == undefined) {
      grd[colArr[0]] = {};
      grd[colArr[0]].myValidation = [];
    }
    if (grd[colArr[0]].myValidation == null || grd[colArr[0]].myValidation == undefined) {
      grd[colArr[0]].myValidation = [];
    }
    var validation = grd[colArr[0]].myValidation;
    var v = {
      criteria: "num(values['" + colArr[0] + "']) <= num(values['" + colArr[1] + "'])",
      message: ld.return_lte_message,
      mode: "always",
      level: "error",
    };
    validation.push(v);
    col.validations = validation;
    grd[colArr[0]].myValidation = validation;
    grd.grid.setColumn(col);
  } else if (option == "returmAmtBiggerThanEqualToPayment") {
    var col = grd.grid.columnByName(colArr[0]);
    if (grd[colArr[0]] == null || grd[colArr[0]] == undefined) {
      grd[colArr[0]] = {};
      grd[colArr[0]].myValidation = [];
    }
    if (grd[colArr[0]].myValidation == null || grd[colArr[0]].myValidation == undefined) {
      grd[colArr[0]].myValidation = [];
    }
    var validation = grd[colArr[0]].myValidation;
    var v = {
      criteria: "num(values['" + colArr[0] + "']) >= num(values['" + colArr[1] + "'])",
      message: ld.returnAmtBTEpayment,
      mode: "always",
      level: "error",
    };
    validation.push(v);
    col.validations = validation;
    grd[colArr[0]].myValidation = validation;
    grd.grid.setColumn(col);
  }
  //  추가 발리데이션 생기면 아래양식으로 정의해 주세요
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // else if(option =='새로운 코드'){
  //   for (var i = 0; i < colArr.length; i++) {
  //     var col = grd.grid.columnByName(colArr[i]);
  //     if(grd[colArr[i]]== null || grd[colArr[i]]== undefined){
  //       grd[colArr[i]]={}
  //       grd[colArr[i]].myValidation = [];
  //     }
  //     if(grd[colArr[i]].myValidation == null || grd[colArr[i]].myValidation == undefined){
  //       grd[colArr[i]].myValidation = [];
  //     }

  //     var validation=grd[colArr[i]].myValidation;
  //     var v = {
  //       criteria: "새로운 표현",
  //       message: "새로운 에러시 메시지",
  //       mode: "always",
  //       level: "error"
  //     }
  //     validation.push(v);
  //     col.validations = validation;
  //     grd[colArr[i]].myValidation=validation;
  //     grd.grid.setColumn(col);
  //   }
  // }
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  // 기본 alert에서 noticeshow로 변경
  grd.grid.onValidationFail = function (grid, itemIndex, column, err) {
    // console.log(err);
    var message = (itemIndex + 1).toString() + " " + ld.row + " " + err.message;
    if (column.renderer == null || column.renderer == undefined) {
      column.renderer = {};
    }
    column.renderer.showTooltip = true;
    grid.setColumn(column);
    gfnNoticeModalShow("error", message);
    return false;
  };
};


/**
 *
 *
 * @param {*} ediname 구분명
 * @param {*} grd 그리드 객체
 * @param {*} fieldName 그리드의 필드 이름
 * @param {*} typeCode db상에서 분기할 type code 명
 */
this.gridCombo = function (ediname, grd, fieldName, typeCode) {
  if (gfnIsNull(typeCode)) typeCode = "code_detail";
  var jsonData = {
    p_type_code: typeCode,
    p_magic_const: ediname,
  };
  var dataName = ediname.replace("[", "").replace("]", "");

  gfn_ajaxTransaction(
    "gridCombo" + dataName,
    "/comm/get_grid_combo_data",
    "",
    dataName + "=output",
    jsonData,
    "gridComboCallBack",
    { grd: grd, fName: fieldName },
    false
  );
};

/**
 *
 *
 * @param {*} grd 그리드 오브젝트
 * @param {*} fieldName 그리드의 컬럼 필드명
 * @param {*} typeCode db상에서의 분기
 * @param {*} masterConst code master 매직콘스트
 * @param {*} detailConst code detail 매직콘스트
 * @param {*} codeName 코드명
 * @param {*} codeValue 코드값
 */
this.gridOptionCombo = function (grd, fieldName, typeCode, masterConst, detailConst, codeName, codeValue) {
  if (gfnIsNull(typeCode)) typeCode = "code_detail_option_scholarship_code";
  var jsonData = {
    p_type_code: typeCode,
    p_code_master_magic_const: masterConst,
    p_code_detail_magic_const: detailConst,
    p_code_detail_option_code_name: codeName,
    p_code_detail_option_code_val: codeValue,
  };
  var dataName = masterConst.replace("[", "").replace("]", "");

  gfn_ajaxTransaction(
    "gridCombo" + dataName,
    "/comm/get_code_detail_option",
    "",
    dataName + "=output",
    jsonData,
    "gridComboCallBack",
    { grd: grd, fName: fieldName },
    false
  );
};

/**
 *
 *
 * @param {*} grd 그리드
 * @param {*} fieldName 그리드의 필드명
 * @param {*} comboName 드롭다운 구분자
 * @param {*} jsonData 서버로 전달할 추가 인자
 */
this.gfn_gridOtherCombo = function (grd, fieldName, comboName, jsonData) {
  jsonData.comboName = comboName;
  if (comboName == "harmful_factor_num") {
    gfn_ajaxTransaction(
      "gridCombo" + comboName,
      "/comm/get_other_combo",
      "",
      comboName + "=output",
      jsonData,
      "gridComboCallBack",
      { grd: grd, fName: fieldName },
      false
    );
  } else if (comboName == "harmful_factor") {
    gfn_ajaxTransaction(
      "gridCombo" + comboName,
      "/comm/get_other_combo",
      "",
      comboName + "=output",
      jsonData,
      "gridComboCallBack",
      { grd: grd, fName: fieldName },
      false
    );
  } else {
    this.alert("잘못된 호출");
  }
};

/**
 *
 *
 * @param {*} id 요청 id
 * @param {*} errcode
 * @param {*} errMsg
 */
this.gridComboCallBack = function (id, errcode, errMsg) {
  var svcId = id.substring(0, 9);
  var dataName = id.replace("gridCombo", "");
  switch (svcId) {
    case "gridCombo":
      var grd = dataset.addParam.grd;
      var fName = dataset.addParam.fName;
      var result = eval("dataset." + dataName);
      var col = grd.grid.columnByName(fName);
      if (gfnIsNull(col.editor) == true) {
        col.editor = {};
      }
      col.editor.type = "dropDown";
      col.editor.domainOnly = "true";
      col.lookupDisplay = true;
      col.editButtonVisibility = "always";
      col.values = [];
      col.labels = [];
      for (var i = 0; i < result.length; i++) {
        col.values.push(result[i].cd);
        col.labels.push(result[i].val);
      }
      grd.grid.setColumn(col);
      break;
    case "accntUnit":
      var grd = dataset.addParam.grd;
      var fName = dataset.addParam.fName;
      var position = dataset.addParam.position;
      var data = dataset.accntUnitData;

      var col = grd.grid.columnByName(fName);
      if (gfnIsNull(col.editor) == true) {
        col.editor = {};
      }
      col.editor.type = "dropDown";
      col.editor.domainOnly = "true";
      col.lookupDisplay = true;
      col.editButtonVisibility = "always";
      col.values = [];
      col.labels = [];

      for (var i = 0; i < data.length; i++) {
        col.values.push(data[i].cd);
        col.labels.push(data[i].val);
      }

      grd.grid.setColumn(col);

      t_arr = [];
      for (var idx = 0; idx < position; idx++) {
        t_arr.push("");
      }
      t_arr.push("11");
      grd.provider.insertRow(0, t_arr);

      grd.grid.onCellEdited = function (grid, itemIndex, dataRow, field) {
        if (field == position) {
          if (grid.getValue(0, "account_manager_name") != "") {
            grid.setValue(0, "account_manager_name", "");
            grid.setValue(0, "account_name", "");
            grid.setValue(0, "account_code", "");
          }
        }
      };
      break;
    case "schDet":
      var grd = dataset.addParam.grd;
      var fName = dataset.addParam.fName;
      var result = dataset.sch_detail_data;
      var col = grd.grid.columnByName(fName);
      if (gfnIsNull(col.editor) == true) {
        col.editor = {};
      }
      col.editor.type = "dropDown";
      col.editor.domainOnly = "true";
      col.lookupDisplay = true;
      col.editButtonVisibility = "always";
      col.values = [];
      col.labels = [];
      for (var i = 0; i < result.length; i++) {
        col.values.push(result[i].cd);
        col.labels.push(result[i].val);
      }
      grd.grid.setColumn(col);
      break;
    default:
      break;
  }
};

/**
 *
 *
 * @param {*} grd
 * @returns true: 변경사항 존재 false: 변경사항 비존재
 */
this.gfn_isGridChanged = function (grd) {
  var jsonData = gfn_getJsonChangedRows(grd);
  if (jsonData.length == 0) {
    return false;
  }
  return true;
};


/**
 * 그리드에 숫자 콤보 박스 생성하기 (1부터 maxNum 이하)
 *
 * @param {*} grd 그리드 태그 id
 * @param {*} colName 해당 컬럼명
 * @param {*} maxNum 최대 숫자
 */
this.gfn_setNumCombo = function (grd, colName, maxNum) {
  var col = grd.grid.columnByName(colName);
  col.labels = [];
  col.values = [];
  for (var idx = 1; idx <= maxNum; idx++) {
    col.labels.push(idx);
    col.values.push(idx);
  }
  if (gfnIsNull(col.editor) == true) {
    col.editor = {};
  }
  col.editor.type = "dropDown";
  col.editor.domainOnly = "true";
  col.lookupDisplay = true;
  col.editButtonVisibility = "always";
  grd.grid.setColumn(col);
};

/**
 * 진행상태에 따라 realgrid checkbar 체크 안되게 하기
 *
 * @param {*} grd 그리드 객체
 * @param {*} process_col 진행상태 uid의 컬럼 이름
 * @param {*} process_uid_arr 체크 가능하게 할 진행상태 uid의 array
 * @param {*} disabled true로 넘기면 배열에 담긴 uid들을 체크 불가로
 */
this.gfn_isProcessCheckFalse = function (_grd, process_col, process_uid_arr, disabled) {
  var returnExp = function () {
    var expression;
    var expressionStringArr = [];
    for (var i = 0; i < process_uid_arr.length; i++) {
      if (disabled) {
        expressionStringArr.push("(value['" + process_col + "'] <> '" + process_uid_arr[i] + "')");
      } else {
        expressionStringArr.push("(value['" + process_col + "'] = '" + process_uid_arr[i] + "')");
      }
    }

    if (disabled) {
      expression = expressionStringArr.join("and");
    } else {
      expression = expressionStringArr.join("or");
    }

    return expression;
  };

  _grd.grid.setCheckBar({
    visible: true,
    checkableOnly: true,
    checkableExpression: returnExp(),
  });
};

/**
 * 진행상태에 따라 row 수정가능 여부
 *
 * @param {*} grd 그리드 객체
 * @param {*} process_col 진행상태 uid의 컬럼 이름
 * @param {*} process_uid_arr 수정/삭제 가능하게 할 진행상태 uid의 array
 * @param {*} disabled true로 넘기면 배열에 담긴 uid들을 수정/삭제 불가로
 */
this.gfn_isProcessEditFalse = function (_grd, process_col, process_uid_arr, disabled) {
  var cols = _grd.grid.getColumnNames(true);
  _grd.grid.process_col = process_col;
  _grd.grid.process_uid_arr = process_uid_arr;
  _grd.grid.disabled = disabled;
  for (var i = 0; i < cols.length; i++) {
    _grd.grid.setColumnProperty(cols[i], "dynamicStyles", function (grid, index, value) {
      var ret = {};
      var process_val = grid.getValue(index.itemIndex, grid.process_col);

      if (grid.disabled) {
        for (var j = 0; j < grid.process_uid_arr.length; j++) {
          if (process_val == grid.process_uid_arr[j]) {
            ret.editable = false;
            ret.updatable = false;
          }
        }
      } else {
        for (var j = 0; j < grid.process_uid_arr.length; j++) {
          if (process_val == grid.process_uid_arr[j] || gfnIsNull(process_val)) {
            ret.editable = true;
          } else {
            ret.editable = false;
            ret.updatable = false;
          }
        }
      }

      return ret;
    });
  }
};

/**
 *
 *
 * @param {*} grd
 * @param {*} fieldName
 * @param {*} position
 * @param {*} isSync
 * @param {*} callBack
 */
this.gfn_setAccntCombo = function (grd, fieldName, position, isSync, callBack) {
  if (gfnIsNull(callBack)) {
    callBack = "gridComboCallBack";
  }
  gfn_ajaxTransaction(
    "accntUnit",
    "/comm/get_account_unit",
    "",
    "accntUnitData=output",
    null,
    callBack,
    { grd: grd, fName: fieldName, position: position },
    null,
    isSync
  );
};

// 생활비지원장학 화면별 장학상세 grid dropdown 만들기
/**
 *
 *
 * @param {*} grd 그리드
 * @param {*} fieldName 필드명
 * @param {*} sch_code 장학코드
 * @param {*} isSync 동기 비동기 여부
 */
this.gfn_setSchDetailCombo = function (grd, fieldName, sch_code, isSync) {
  var arg = {
    p_type_code: "code_detail_option_scholarship_code",
    p_code_master_magic_const: "[장학상세]",
    p_code_detail_magic_const: "",
    p_code_detail_option_code_name: "CD1",
    p_code_detail_option_code_val: sch_code,
  };
  gfn_ajaxTransaction(
    "schDet",
    "/comm/get_code_detail_option",
    "",
    "sch_detail_data=output",
    arg,
    "gridComboCallBack",
    { grd: grd, fName: fieldName },
    null,
    isSync
  );
};

// 승인요청 팝업 띄우기 전 계좌정보, 공급자ID validation
/**
 *
 *
 * @param {*} grd 그리드 객체
 * @param {*} student_number 학번 컬럼명
 * @param {*} bank_account_number 계좌번호 컬럼명
 * @param {*} vendor_site_id 공급자ID 컬럼명
 */
this.gfn_request_check = function (grd, p_student_number, p_bank_account_number, p_vendor_site_id) {
  var rowCount = grd.grid.getItemCount();

  if (rowCount <= 0) {
    gfnNoticeModalShow(ld.notice_modal, ld.request_check_msg);
    return false;
  }

  for (var idx = 0; idx < rowCount; idx++) {
    var student_number = grd.grid.getValue(idx, p_student_number);
    var bank_account_number = grd.grid.getValue(idx, p_bank_account_number);
    var vendor_site_id = grd.grid.getValue(idx, p_vendor_site_id);
    var process_status = grd.grid.getValue(idx, "process_status_code_uid");

    // sch_fos_1100 의 process_status_code_uid 가 id 가 달라서 예외처리
    // TODO: sch_fos_1100 에서 id 를 맞춰주거나, 여기 하드코드 된 것을 제거해야 함.
    //if (gfnIsNull(process_status)) {
    //process_status = grd.grid.getValue(idx, 'process_status_uid');
    //}

    console.log(
      "idx= " +
        idx +
        ", student_number= " +
        student_number +
        ", ban= " +
        bank_account_number +
        ", vsi= " +
        vendor_site_id +
        ", ps= " +
        process_status +
        "\n"
    );

    if (gfnIsNull(bank_account_number) || gfnIsNull(vendor_site_id) || vendor_site_id == 0 || vendor_site_id == -1) {
      if (gfnIsNull(process_status)) {
        gfnNoticeModalShow(ld.notice_modal, student_number + ld.request_check_msg2);
        return false;
      }
    }
  }
  return true;
};





//////////////////
/**
 * 그리드 데이터 JSON으로 변환
 * @param {String, Array} gridId 
 */
function gfnSetGridDataToJson(gridId) {
  var gridIds = [];
  if (typeof gridId === 'string') {
      gridIds.push(gridId);
  } else {
      gridIds = gridId
  }
  
  return gridIds.reduce(function(acc, gridId) {
      var grid = window[gridId];
      if (!gfnGridCommit(grid)) return;

      var allStateRows = grid.provider.getAllStateRows();

      var data = Object
          .keys(allStateRows)
          .reduce(function(acc, key) {
              acc[key] = allStateRows[key].map(function(row) {
                  return grid.provider.getJsonRow(row);
              });
              
              return acc;
          }, {});
      
      acc[gridId] = data;
      return acc;
  }, {});
}


function gfn_getJsonChangedRows(_grd) {
  _grd.grid.commit(false);
  var jsonArray = new Array();
  var rows = null;
  var state = $(':radio[name="rbRowStateArray"]:checked').val();
  if (!state || state == "all") {
    rows = _grd.provider.getAllStateRows(); // RowState.NONE은 포함되지 않는다.
  } else {
    rows = _grd.provider.getStateRows(state);
  }
  for (var i = 0; i < rows.deleted.length; i++) {
    //var jsonObj = new Object();
    var jsonObj = _grd.provider.getJsonRow(rows.deleted[i]);
    jsonObj.t = "d";
    jsonObj.wrk_tp = "D";
    jsonObj.row = rows.deleted[i];

    var keys = _grd.provider.getOrgFieldNames();

    if (keys.indexOf("err_msg") > -1 && !gfnIsNull(jsonObj.err_msg)) {
      continue;
    }

    for (var idx = 0; idx < keys.length; idx++) {
      if (jsonObj[keys[idx]] == undefined) {
        jsonObj[keys[idx]] = "";
      }
    }

    jsonArray.push(jsonObj);
  }

  for (var i = 0; i < rows.updated.length; i++) {
    //var jsonObj = new Object();
    var jsonObj = _grd.provider.getJsonRow(rows.updated[i]);
    jsonObj.t = "u";
    jsonObj.wrk_tp = "U";
    jsonObj.row = rows.updated[i];

    var keys = _grd.provider.getOrgFieldNames();
    for (var idx = 0; idx < keys.length; idx++) {
      if (jsonObj[keys[idx]] == undefined) {
        jsonObj[keys[idx]] = "";
      }
    }

    //jsonObj.json = jsonRow;
    jsonArray.push(jsonObj);
  }
  for (var i = 0; i < rows.created.length; i++) {
    //var jsonObj = new Object();
    var jsonObj = _grd.provider.getJsonRow(rows.created[i]);
    jsonObj.t = "i";
    jsonObj.wrk_tp = "I";
    jsonObj.row = rows.created[i];

    var keys = _grd.provider.getOrgFieldNames();
    for (var idx = 0; idx < keys.length; idx++) {
      if (jsonObj[keys[idx]] == undefined) {
        jsonObj[keys[idx]] = "";
      }
    }

    jsonArray.push(jsonObj);
  }
  return jsonArray;
}


/** 
 * 함 수 명 : gfnExcelDownload
 * 설    명 : 엑셀 다운로드 함수
 * 리턴형식 : N/A
 * 매개변수 
 * @param {*} grid 그리드 객체명(e.g. grid1, grid2 등)
 * @param {*} fileName 엑셀파일명(e.g. 메뉴목록, 사용자목록 등)
 * @param {*} sheetName 시트명(e.g. 메뉴자료, 사용자자료 등)
**/
function gfnExcelDownload(grid, fileName, sheetName) {
  // 화면에 그리드가 1개일 경우 
  // 화면의 그리드 타이틀을 출력
  // 화면의 그리드가 1개 이상일 경우 파일명 및 시트명 필수
  if (!fileName) {
    fileName = grid.closest('.grid').find('.grid-title__name').text().trim();
  }

  // 시트명은 파일명과 동일하게 처리
  if (!sheetName) {
    sheetName = fileName;
  }

  RealGridJS.exportGrid({
    type:"excel",
    target:"local",
    fileName: fileName +".xlsx",
    compatibility: '2010',
    done:function() {
      // alert("done excel export")
    },
    exportGrids:[
      { 
          grid: grid.gridView,  // 그리드 객체
          sheetName: sheetName // 시트명
      }
    ]
  });
}


// 체크박스 된 데이터 행삭제
function gfnDeleteRowChk(grid) {
  var items = grid.gridView.getCheckedItems(true);
  
  if (!items.length) {
    $("#errorModal #errorModalContents").html("선택된 데이터가 없습니다.");
    $("#errorModal").modal("show");
    return false;
  }

  $("#confirmModal #confirmModalContents").html("삭제하시겠습니까?");
  $("#confirmModal").modal("show");

  $('#confirmModal #confirm').unbind().click(function() {
    // itemIndex로 gridView의 dataRow 찾기
    var rows = items.map(function(item) {
      return grid.gridView.getDataRow(item); 
    });
    
    grid.provider.hideRows(rows);
    grid.gridView.cancel();
    grid.provider.removeRows(rows);
  });
  return true;
}



/** 
 * 함 수 명 : gfnGridCommit
 * 설    명 : 그리드 변경된 내용을 커밋
 * 리턴형식 : true / false
 * 매개변수 
 * @param {*} grid 그리드 객체명(e.g. grid1, grid2 등)
**/
function gfnGridCommit(grid, force) {
  if (!force) {
    force = false; 
  }
  
  try {
    grid.gridView.commit(force);
    return true;
  } catch (e) {
    gfnShowErrorModal(e.message);
    return false;
  }
};

/** 
 * 함 수 명 : gfnGridCommit
 * 설    명 : 그리드 변경된 내용을 커밋
 * 리턴형식 : true / false
 * 매개변수 
 * @param {*} grid 그리드 객체명(e.g. grid1, grid2 등)
**/
function gfnSaveValidate(grid) {
  // 그리드 커밋 함수에서 오류면 리턴
  if (!gfnGridCommit(grid)) {
    return false;
  } 

  if (grid.provider.getRowCount() === 0) {    
    gfnShowErrorModal("저장할 데이터가 존재하지 않습니다.");
    return false;
  }

  if(!gfnGridIsChanged(grid)) {
    gfnShowErrorModal("변경된 내역이 없습니다.");
    return false;
  }  
  // var message = "";      
  // // 그리드 컬럼별 체크 널일 경우 정상
  // log = grid.gridView.checkValidateCells();      

  // if (!log) {    
  //   return true;
  // } else {
  //   for (var i = log.length - 1; i > -1; i--) {
  //     var itemIndex = grid.gridView.getItemIndex(log[i].dataRow);
  //     message += (itemIndex + 1).toString() + " " + ld.row + " " + log[i].message + "\n";
  //   }

  //   gfnShowErrorModal("필수항목을 입력하시기 바랍니다.");
  //   return false;
  // }
  
  return true;
};

 /**
  * 
  * @param {Object} grid 
  */
//  function gfnCheckSaveData(grid) {
//   if (!gfnSaveValidate(grid)) return false;

//   var resultValue = false;
//   // 확인 메시지 출력  
//   $("#confirmModal #confirmModalContents").html("저장하시겠습니까?");
//   $("#confirmModal").modal("show");
//   $('#confirmModal #confirm').unbind().click(function() {
//     resultValue = true;
//   });
//   $('#confirmModal #cancel').unbind().click(function() {    
//     resultValue = false;
//   });
//   return resultValue;
// };

// 확인 메시지
function gfnConfirm(message, callback) {
  // 확인 메시지 출력  
  $("#confirmModal #confirmModalContents").html(message);
  $("#confirmModal").modal("show");
  $('#confirmModal #confirm').unbind().click(function() {
    callback();
  });
};

// 에러메시지 모달 띄우기
function gfnShowErrorModal(errorMessage) {
  $("#errorModal #errorModalContents").html(errorMessage || "");
  $("#errorModal").modal("show");
}

// 변경내역 확인
function gfnGridIsChanged(grid) {
  var allStateRows = grid.provider.getAllStateRows();
  var isUpdated = 
    Object
      .keys(grid.provider.getAllStateRows())
      .some(function(key) {
          return allStateRows[key].length;
      });
  return isUpdated;
}

// 변경내역 확인2
function gfnGetGridStateCount(grid) {
  var allStateRows = grid.provider.getAllStateRows();
  return Object
      .keys(grid.provider.getAllStateRows())
      .reduce(function(acc, key) {
          acc[key] = allStateRows[key].length;
          return acc;
      }, {});
}