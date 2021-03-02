
/**
 *
 * 
 * 그리드 변수명은 반드시 grd로 시작할것!!!!!!!!!!!!!!!!!!!!!!
 * @param {*} svcID callBack ID 
 * @param {*} callUrl 호출할 url 
 * @param {*} inDatasets input=grd1:u  => grd1의 변경된 행을 인풋으로 사용
 *                       input=grd1 => grd1의 모든 행을 인풋으로 사용
 *                       input=grd1 input2=grd2:u  인풋에 grd1의 모든행 인풋2dp grd2의 업데이트 되어진 행을 사용한다.
 *                                                 인풋과 인풋2가 공백으로 구분되어짐
 * @param {*} outDatasets grd1=output 결과를 grd1에 행으로 자동 삽입
 *                        data=output 결과를 data object에 자동으로 삽입해줌
 * @param {*} argument    추가적으로 전달할 데이터 JSON형태로 주어야함
 * @param {*} callbackFunc 콜백함수
 * @param {*} callbackParams callBack함수에 전달할 추가 파라미터  json 형태로 주세요
 * @param {*} showProgress progress 보여줄 여부
 * @param {*} async       동기 = false 비동기 = true 로 전달 default = true
 * @returns result
 */
function gfn_ajaxTransaction(svcID, callUrl, inDatasets, outDatasets, argument, callbackFunc, callbackParams, showProgress, async) {
    // this.console.log("gfn_ajaxTransaction..........")
    if (this.gfn_isNull(argument)) argument = "";
    if (this.gfn_isNull(callbackFunc)) callbackFunc = "fn_callBack";
    if (this.gfn_isNull(showProgress)) showProgress = true;
    if (this.gfn_isNull(async)) async = true;
    if (this.gfn_isNull(callbackParams)) cbParams = null;
    if (showProgress) loadshow();
    // console.log(callbackParams);
    var sendObj = new Object();
    var transinfo = new Object();
    var strSvcID = svcID + "|" + callbackFunc + "|" + outDatasets;

    var procdata = this.gfn_makeProcdata(inDatasets);
    transinfo.svcid = strSvcID;
    transinfo.indatasets = inDatasets;
    transinfo.outdatasets = outDatasets;
    sendObj.transinfo = transinfo;
    sendObj.procdata = procdata;
    sendObj.argument = argument;

    // this.console.log("sendObj..",sendObj);
    var result;
    var addrnd = '?rnd=';
    if (callUrl.indexOf('?') > 0) {
        addrnd = '&rnd=';
    } else {
        addrnd = '?rnd=';
    }

    result = $.ajax({
        url: callUrl,
        type: 'POST',
        async: async,
        dataType: "json",
        data: JSON.stringify(sendObj),
        success: function (data) {
            return_data = err_check_json(data);
            if (return_data['r_cd'] >= 0) {
                gfn_setInOutDatasets(outDatasets, inDatasets, data);
                // console.log(strSvcID);
                gfn_transactionCallBack(strSvcID, return_data['r_cd'], return_data['r_desc'], callbackParams);
            }
            else if (return_data['r_cd'] == -99) {
                location.href = '/login?next=/static/dev/codereview.html';
            }
            if (showProgress) {
                loadhide();
                try {
                    if (parent.window) {
                        parent.window.loadhide();
                    }
                } catch (error) {

                }
            }
        },
        error: function (req, status, err) {

            // console.log(req);
            // console.log("status.." + status);
            // console.log("err.." + err);
            // alert('error')
            loadhide();
            try {
                if (parent.window) {
                    parent.window.loadhide();
                }
            } catch (error) {
            }
            if (req.status == '403') {
                location.href = '/login?next=/static/dev/codereview.html';
            }
            else if (req.status === 0 && req.statusText === 'abort') {
                //abort
            }
            else {
                waringshow(ld.notice_modal, '이메시지를 만나면 화면이름과 호출 명등을 알려 주세요' + err + req.responseText);
            }
        },
    });
    return result;
}

this.gfn_makeProcdata = function (inDatasets) {
    var procdata = new Object();
    if (!this.gfn_isNull(inDatasets)) {
        var arrDatasets = inDatasets.split(" ");
        // this.alert("?")
        for (var i = 0; i < arrDatasets.length; i++) {
            var arrDataset = arrDatasets[i].split("=")
            var arrSub = arrDataset[1].split(":")
            if (arrDataset[1].toLowerCase().indexOf('tree') >= 0) {
                if (arrSub.length == 1) {
                    eval("procdata." + arrDataset[0] + "=" + JSON.stringify(window[arrDataset[1]].provider.getJsonRows(0, -1)));
                } else {
                    if (arrSub[1] == "U") {
                        // console.log(gfn_getTreeJsonChangedRows(arrSub[0]));
                        eval("procdata." + arrDataset[0] + "=" + JSON.stringify(gfn_getTreeJsonChangedRows(arrSub[0])));
                    }
                    else {
                        // console.log(JSON.stringify(window[arrDataset[1]].provider.getJsonRows(0, -1)));
                        eval("procdata." + arrDataset[0] + "=" + JSON.stringify(window[arrDataset[1]].provider.getJsonRows(0, -1)));
                    }
                }
            } else if (arrDataset[1].substring(0, 3) == "grd") {
                if (arrSub.length == 1) {
                    eval("procdata." + arrDataset[0] + "=" + JSON.stringify(window[arrDataset[1]].provider.getJsonRows(0, -1)));
                } else {
                    if (arrSub[1] == "U") {
                        eval("procdata." + arrDataset[0] + "=" + JSON.stringify(gfn_getJsonChangedRows(window[arrSub[0]])));
                    }
                    else if (arrSub[1] == 'C') {
                        eval("procdata." + arrDataset[0] + "=" + JSON.stringify(gfn_getJsonCheckedRows(window[arrSub[0]])));
                    }
                    else {
                        eval("procdata." + arrDataset[0] + "=" + JSON.stringify(window[arrDataset[1]].provider.getJsonRows(0, -1)));
                    }
                }
            } else {
                eval("procdata." + arrDataset[0] + "=" + JSON.stringify($("#" + arrDataset[1]).serializeArray()));
            }
        }
    }
    return procdata;
}

this.gfn_setInOutDatasets = function (outDatasets, inDatasets, data) {
    if (!gfn_isNull(outDatasets)) {
        var arrOutDataset = outDatasets.split(" ");
        for (var i = 0; i < arrOutDataset.length; i++) {
            var arr = arrOutDataset[i].split("=");
            if (arr[0].toLowerCase().indexOf('tree') >= 0) {
                treeProvider = window[arr[0] + "Provider"];
                darr = eval("data.resdata." + arr[1]);//json array;
                treeProvider.fillJsonData(darr, { rows: "rows", icon: "icon" });
            } else if (arr[0].substring(0, 3) == "grd") {
                var cursor = 0;
                if (!gfn_isNull(data.cursor)) {
                    cursor = data.cursor
                }
                _grd = window[arr[0]];
                _grd.grid.orderBy([]);
                darr = eval("data.resdata." + arr[1]);//json array;
                _grd.grid.cancel();
                // 그리드 초기화 해주기
                _grd.provider.setRowCount(0);
                _grd.provider.clearRows();
                _grd.provider.fillJsonData(darr, { rows: "rows" });
                _grd.grid.setCurrent({ itemIndex: cursor });
                $('#frowinfo_' + $(_grd).attr('id')).text("(" + darr.length + " 건)");
            } else {
                dataset[arr[0]] = data.resdata[arr[1]];
                eval("dataset." + arr[0] + "= data.resdata." + arr[1]);

            }
        }
    }
    if (!gfn_isNull(inDatasets)) {
        var arrDatasets = inDatasets.split(" ");
        for (var i = 0; i < arrDatasets.length; i++) {
            var arrDataset = arrDatasets[i].split("=")
            var arrSub = arrDataset[1].split(":")
            if (arrDataset[1].toLowerCase().indexOf('tree') >= 0) {
                window[arrSub[0]].commit(true);
            } else if (arrDataset[1].substring(0, 3) == "grd") {
                window[arrSub[0]].grid.commit(true);
            }
        }
    }
}
/**
 * 이 함수가 먼저 수행되고 사용자지정Callback함수가 수행된다.
 * @param {string} svcID
 * @param {string} 에러코드
 * @param {string} 에러 메시지
 * @return N/A
 * @example
 * @memberOf global
 */
this.gfn_transactionCallBack = function (svcID, errorCode, errorMsg, cbParams) {
    // console.log(svcID);
    // loadhide();

    var arrSvcID = svcID.split("|");

    errorCode = this.gfn_bizExceptionCheck(errorMsg, errorCode);

    if (errorCode < 0) {
        alert(errorMsg);
    }

    if (arrSvcID.length > 1 && !this.gfn_isNull(arrSvcID[1])) {
        var strExpr = "this." + arrSvcID[1] + "('" + arrSvcID[0] + "', " + errorCode + ", '" + errorMsg + "')";
        if (!this.gfn_isNull(cbParams) == true) {
            dataset.addParam = cbParams;
        }
        else {
            dataset.addParam = null;
        }
        // console.log(comboCallBack);
        // console.log( "strExpr : "+strExpr);
        eval(strExpr);
    }
}

this.gfn_bizExceptionCheck = function (errorMsg, errorCode) {
    return errorCode;
}

/**
* = 을 배열로 분리 처리
* @param {string} objString (inds=inds)
* @param {number} 0 : 배열 첫번째값 1: 배열 두번째값
* @return {string} return 된 배열값
* @example
* @memberOf global
*/
this.gfn_splitDsName = function (objString, type) {
    var strDsMapping;			//mapping string
    var objArr;					//dataset name array
    var objReturn = new Array();

    strDsMapping = objString.split(" ");

    for (var i = 0; i < strDsMapping.length; i++) {
        objArr = strDsMapping[i].split("=");    // objArr = a,cd
        if (type == 0)
            objReturn[i] = objArr[0];
        else
            objReturn[i] = objArr[1];
    }

    return objReturn;
}

this.err_check_json = function (_data) {
    var result = [];
    var r_cd = -1;
    var r_desc = 'error';
    /*
    $(_data).find('status').each(function () {
      r_cd = $(this).find('rescd').text();
      r_desc = $(this).find('resdesc').text();
    });
    */
    r_cd = _data.rescd;
    r_desc = _data.resdesc;
    if (r_cd < 0) {
        // if (parent.window) {
        //     parent.window.loadhide();
        // }

        // else {
        //     loadhide();
        // }

        waringshow(ld.notice_modal, r_desc);
    }

    result['r_cd'] = r_cd;
    result['r_desc'] = r_desc;
    result['r_data'] = _data;

    return result;
}