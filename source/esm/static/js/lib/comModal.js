

/**
 * iframe document 가져오기
 @param {string} frmname iframe id
 @param {string} parents 모달에서 다른 모달의 document 필요할 때 | boolean
*/
function gfn_getiframeDocument(frmname, parents) {
    if (parents) {
        // 미사용 (보류)
        // $iframe = $(parent.frames[frmname]);
        // $iframe = $('#' + frmname, parent);
        // console.log(parent.frames[frmname]);
    }
    else {
        $iframe = $('#' + frmname);
    }
    var iframeDoc = $iframe[0].contentWindow || $iframe[0].contentDocument;
    if (iframeDoc.document) {
    }
    return iframeDoc;
}


// modal의 버튼을 동적으로 생성하기 위한 함수 (setModal에서 호출)
function setModalButton(obj) {
    var btn = '';
    for (var index = 0; index < obj.length; index++) {
        if (gfnIsNull(obj[index].color)) {
            obj[index].color = 'red';
        }

        btn = btn
            + '<button type="button" class="btn'
            + ' btn_' + obj[index].color
            + ' btn_' + obj[index].width
            + '" id="' + obj[index].id + '">'
            + obj[index].text + '</button>';
    }
    return btn;
}

/**
 * modal Init (2000tmp.html 참고)
 @param {string} set - json obj 로 넘겨주세요

                 key     val
 @param {string} width : px단위 | int
 @param {string} height : px단위 | int
 @param {string} modal_id : modal id | string
 @param {string} modal_title : modal 제목 | string
 @param {string} modal_button : json array 
                 key - id (버튼의 id) 
                 key - text (버튼의 내용) 
                 key - width (버튼의 길이 클래스 ex) short, middle..) 
                 key - color (버튼의 색상) ex) red, green... | default = red
 @param {string} hide_close_button : 닫기 버튼 비활성화 | boolean | default = false 
*/
function gfn_setModal(set) {
    var modal_id = set.modal_id;
    var frame_id = modal_id.replace("modal", "frame");
    var title = set.modal_title;

    var button = '';
    if (gfnIsNull(set.modal_button) == false) {
        button = setModalButton(set.modal_button);
    }

    var close_button = '<button type="button" class="btn btn_short" data-dismiss="modal">' +
        ld.close + '</button>';
    if (set.hide_close_button) {
        close_button = '';
    }

    var width = set.width;
    var height = set.height;

    $("#" + modal_id).attr({
        "class": "modal fade",
        "tabindex": "-1",
        "role": "dialog",
        "aria-hidden": "true",
        "data-backdrop": "static",
        "data-keyboard": "false"
    });

    $("#" + modal_id).html(
        '<div class="modal-dialog" role="document">'
        + '<div class="modal-content" style="width:' + width + 'px;">'
        + '<div class="modal-header">'
        + '<h3><span id="mh_title"></span>&nbsp;&nbsp;' + title + '</h3>'
        + '<button type="button" class="btn_modal_close" data-dismiss="modal">X</button>'
        + '</div>'
        + '<div class="modal-body">'
        + '<iframe src="" frameborder="0" id="' + frame_id + '" style="width:100%; height: 500px;"></iframe>'
        + '</div>'
        + '<div class="modal-footer">'
        + button
        + close_button
        + '</div>'
        + '</div>'
        + '</div>');

    $("#" + modal_id).on("show.bs.modal", function () {
        $("#" + frame_id).css("height", height);
    });

    // Jquery draggable
    $('.modal-dialog').draggable({
        handle: ".modal-header"
    });
}

/**
 * modal Open
 @param {string} modalId modal id
 @param {string} _url modal url
 @param {string} innerFn modal open전 실행 할 함수
 @param {string} args innerFn의 args
 @param {string} shownFn modal shown 후 함수
 @param {string} shownArgs shownFn의 args
*/
function gfn_openModal(modalId, _url, innerFn, args, shownFn, shownArgs) {
    var frame;
    $("#" + modalId).find("iframe").each(function () {
        frame = $(this).attr("id");
    });

    gfnLoadshow();
    $("#" + frame).attr("src", _url);
    $("#" + frame).on("load", function () {
        if (innerFn == '' || innerFn == null || innerFn == undefined) {
        }
        else {
            innerFn(args);
        }

        gfnLoadhide();
        $("#" + modalId).modal("show");
    });

    $("#" + modalId).on("shown.bs.modal", function () {
        if (shownFn == '' || shownFn == null || shownFn == undefined) {
        }
        else {
            shownFn(shownArgs);
        }
        $("#" + modalId).off("shown.bs.modal");
    });

    $("#" + modalId).on("hide.bs.modal", function () {
        $("#" + frame).off("load");
    });
}

/**
 * modal 안에서 modal open
 @param {string} modalId modal id | 호출 할 모달은 최상단 부모에 선언 (메인화면에)
 @param {string} _url modal url
 @param {string} innerFn modal open전 실행 할 함수
 @param {string} args innerFn의 args
 @param {string} shownFn modal shown 후 함수
 @param {string} shownArgs shownFn의 args
 @param {string} pNode 모달 안의 모달 안의 모달 (3개 이상) 호출 할 때
                       메인 화면 까지의 노드 갯수를 써주면 됨
                       ex) 모달 안의 모달에서 새로운 모달을 호출 할 땐 2
*/
function gfn_openInnerModal(modalId, _url, innerFn, args, shownFn, shownArgs, pNode) {

    if (gfnIsNull(pNode)) {
        pNode = 1;
    }

    var parentsFn = "";
    for (var i = 1; i <= pNode; i++) {
        parentsFn += "parent.window.";
    }

    parentsFn += "gfn_openModal(modalId, _url, innerFn, args, shownFn, shownArgs)";

    // eval 함수를 익명함수로 감싸서 변수를 전역변수가 아닌 익명함수의 로컬변수로 만든다.
    (function () { eval(parentsFn); }());
}
