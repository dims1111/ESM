// 모달팝업 캡슐화
var modalPopup = (function () {
  var dialogs = {};
  var callbacks = {};

  return {
    open: function (obj) {
      var _title = obj.title;
      var _popupId = obj.popupId || "";
      var _height = obj.fullLayer ? $(window).height() - 12 : obj.height || "600";
      var _width = obj.fullLayer ? $(window).width() - 12 : obj.width || "800";
      var _draggable = !obj.fullLayer;
      var _resizable = obj.resizable || false;
      var _url = obj.url;
      var _params = '';
      if (obj.params) {
        _params = Object.entries(obj.params).map(e => {
          return e[0] + '=' + decodeURIComponent(e[1]);
        }).join('&');
      }
      var _callback = obj.callbackFn;
      var _position = obj.position || {};
      var _PageUrl = _url;
      var _method = obj.method || "post";
  
      if ($("#" + _popupId).length === 0) {
        $("body").append(
          $("<div/>", {
            id: _popupId,
          })
        );
  
        if (_callback) {
          callbacks[_popupId] = _callback;
        }
  
        var $iframe = $(document.createDocumentFragment()).append(
          $("<iframe/>", {
            id: _popupId + "Iframe",
            name: _popupId,
            src: _method === "get" ? _url + "?" + _params : "",
            css: {
              width: "100%",
              height: "100%",
            },
          })
        );
  
        var $sPopupId = $("#" + _popupId);
        $sPopupId.append($iframe);
  
        // dialog 생성
        dialogs[_popupId] = $sPopupId.dialog({
          dialogClass: "modal-popup",
          width: _width,
          height: _height,
          autoOpen: true,
          modal: true,
          draggable: _draggable,
          resizable: _resizable,
          closeOnEscape: false,
          position: _position,
          title: _title,
          open: function (event, ui) {
            // POST방식은 form태그로 화면 호출
            if (_method === "post") {
              var form = document.createElement("form");
              form.setAttribute("charset", "UTF-8");
              form.setAttribute("method", "post");
              form.setAttribute("target", _popupId);
              form.setAttribute("action", _PageUrl);
  
              var input;
              var ppp = _params.split("&");
              for (var i = 0; i < ppp.length; i++) {
                var param = ppp[i];
                var key = param.split("=")[0];
                var value = param.split("=")[1];
  
                input = document.createElement("input");
                input.setAttribute("type", "hidden");
                input.setAttribute("name", key);
                input.setAttribute("value", decodeURIComponent(value));
                form.appendChild(input);
  
                document.body.appendChild(form);
              }
  
              // Django csrf
              input = document.createElement("input");
              input.setAttribute("type", "hidden");
              input.setAttribute("name", 'csrfmiddlewaretoken');
              input.setAttribute("value", getCookie('csrftoken'));
              form.appendChild(input);
  
              form.submit();
            }
          },
          close: function (event) {
            $("#" + _popupId).remove();
          },
        });
      }
    },
    callback: function (data, windowName) {
      var name = callbacks[windowName];
      window[name](windowName, data);
    },
    close: function(windowName) {
      dialogs[windowName].dialog("close");
    }
  };
})();

// 모달 호출
function gfnOpenModalPopup(obj) {
  modalPopup.open(obj);
}

//////////////////////////////////////////////////////////

// 콜백함수 호출 (모달window 내에서 실행하는 함수)
function gfnCallbackModalPopup(data) {
  var windowName = window.name;

  // parent의 modalPopup객체에서 콜백함수 찾음
  parent.modalPopup.callback(data, windowName);
}

// 모달 닫기 (모달window 내에서 실행하는 함수)
function gfnCloseModalPopup() {
  var windowName = window.name;
  parent.modalPopup.close(windowName);
}