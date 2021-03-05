function gfnGetData(params, callback) {
  $.ajax({
    type: "POST",
    url: params.url,
    data: params.mainParam,
    async: params.aync || true,
    dataType: "json",
    success: function (res) {
      if (res) {
        if (callback) {
          callback(res); // 콜백함수 호출
        }
      }
    },
    error: function (req, status, err) {
      if (req.status == "403") {
        // 로그인 페이지로 호출
        moveToLoginPage();
      }
    },
  });
}

function gfnGetGrdData(params, callback) {
  // params.grid 내용을 배열로 다건을 받을 경우, 배열 순서대로 콜할 예정
  var gridArr = [];
  if (typeof params.grid === "string") {
    gridArr.push(params.grid);
  } else {
    gridArr = params.grid;
  }

  for (var i = 0; i < gridArr.length; i++) {
    var grid = gridArr[i];
    // IIFE ( Immediately Invoked Function Expression)
    (function (grid) {
      // window[grid].gridView.commit(false);
      window[grid].gridView.cancel();

      // 로딩바 생성
      gfnLoadshow(window[grid]);

      $.ajax({
        type: "POST",
        url: params.url,
        data: params.mainParam,
        async: params.aync || true,
        dataType: "json",
        success: function (res) {
          console.log("res =>", res);
          if (res) {
            // 데이터가져오기
            var result = res.data;

            // 임시로 여기서 메뉴 건수 추가함
            var titleCnt = result ? result.length : 0;
            var titleCntText = "(" + gfnMakeComma(titleCnt) + "건)";
            window[grid].closest(".grid").find(".grid-title__cnt").text(titleCntText);

            // console.log(result);
            window[grid].provider.setRows(result);

            // 메시지 출력
            if (res.msg) {
              // 오류 또는 정상이지만 메시지가 존재하면 파업 메시지 출력
              $("#errorModal #errorModalContents").html(res.msg);
              $("#errorModal").modal("show");
            }

            // 콜백함수 호출
            if (callback) {
              callback();
            }
          }

          // 로딩바 제거
          gfnLoadhide(window[grid]);
        },
        error: function (req, status, err) {
          if (req.status == "403") {
            // 로그인 페이지로 호출
            moveToLoginPage();
          } else if (req.status == "500") {
            console.log("req.status =>", req.status);
            $("#errorModal #errorModalContents").html('서버 에러');
            $("#errorModal").modal("show");
          }

          // 에러체킹 후 return할 예정

          // 로딩바 제거
          gfnLoadhide(window[grid]);
          return;
        },
      });
    })(grid);
  }
}


function gfnSetGrdData(params, callback) {
  var gridArr = [];
  
  if (typeof params.grid === "string") {
    gridArr.push(params.grid);
  } else {
    gridArr = params.grid;
  }

  // 그리드 검증
  for (var i = 0; i < gridArr.length; i++) {
    var grid = gridArr[i];
    if (!gfnSaveValidate(window[grid])) return;
  }

  gfnConfirm("저장하시겠습니까?", function() {
    var data = gfnSetGridDataToJson(gridArr);
    // 추가적인 파라미터 있으면 어떻게할건지
    if (params.subParam) {
    }
    
    // 로딩바 생성
    gfnLoadshow();
  
    $.ajax({
      type: "POST",
      url: params.url,
      data: JSON.stringify(data),
      async: params.aync || true,
      dataType: "json",
      success: function (res) {
        if (res) {
          // 에러가 발생할 경우 모달 출력
          console.log("res =>", res);
          if (res.msg) {
            $("#errorModal #errorModalContents").html(res.msg);
            $("#errorModal").modal("show");
            if (res.cd === "E") {
              // 로딩바 제거
              gfnLoadhide();
              return;
            }
          }
  
          if (callback) {
            callback();
          }
        }
        // 로딩바 제거
        gfnLoadhide();
      },
      error: function (req, status, err) {
        if (req.status == "403") {
          // 로그인 페이지로 호출
          moveToLoginPage();
        }
  
        // 에러체킹 후 return할 예정
        // 로딩바 제거
        gfnLoadhide();
        return;
      },
    });
  });


}