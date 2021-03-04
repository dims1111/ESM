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
      var _params = obj.params;
      var _callback = obj.callbackFn;
      var _position = obj.position || {};
      var _PageUrl = _url;
      var _method = obj.method || "post";
  
      // 앞 '&'문자 지우기
      if (_params && _params[0] === "&") {
        _params = _params.substr(1);
      }
  
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
            name: _popupId + "Iframe",
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
              form.setAttribute("target", _popupId + "Iframe");
              form.setAttribute("action", _PageUrl);
  
              var input;
              for (var param of _params.split("&")) {
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
            // 콜백이 있을 경우 닫기 전 호출
            if (_callback) {
              var success = window[_callback] && window[_callback](_popupId);
  
              // 콜백에서 false로 리턴했을 경우 닫지 않음
              if (success === false) {
                return;
              }
            }
            $("#" + _popupId).remove();
          },
        });
      }
    },
    callback: function (id, param) {
      console.log('callbacks', callbacks)
      console.log('ModalPopup.prototype.close', callbacks[id]);
      window[callbacks[id]](id, param);
    },
    close: function(id) {
      console.log('ModalPopup.prototype.close', id)
      if (dialogs[id]) {
        dialogs[id].dialog("close");
      } else {
        for (var openedLayer of dialogs) {
          openedLayer.dialog("close");
        }
      }
    }
  };
})();

function gfnOpenModalPopup(e) {
  modalPopup.open(e);
}

function gfnCallbackModalPopup(e, t) {
  modalPopup.callback(e, t);
}
function gfnCloseModalPopup(e) {
  modalPopup.close(e);
}
