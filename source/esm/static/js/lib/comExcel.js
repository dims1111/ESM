
// function addExcellUp(target) {
//   $('#' + target).prepend('');
// }

/**
 *
 *
 * @param {*} grd 그리드
 * @param {*} fileName 파일명
 * @param {*} cbFunc 콜백함수 
 * @param {*} cbParam 콜백 파라매터
 */
this.gfn_exportGridExcel = function (grd, fileName, cbFunc, cbParam) {
  grd.grid.exportGrid({
    type: "excel",
    target: "local",
    fileName: fileName,
    showProgress: true,
    applyDynamicStyles: true,
    progressMessage: ld.exporting,
    indicator: "visible",
    header: "visible",
    footer: "hidden",
    compatibility: true,
    lookupDisplay: true,
    done: function () {
      if (cbFunc) {
        cbFunc(cbParam);
      }
    }
  });
}