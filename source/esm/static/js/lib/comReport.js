/**
 *
 *
 * @param {*} crfname  리포트파일명 확장자 빼고
 * @param {*} params : '201601|준석'
 */
function report_show(crfname, params) {
    var param_str = btoa(encodeURIComponent(params));
    var hostName = location.hostname;
    var clipUrl = 'http://acadrs.kaist.ac.kr';
    if (hostName.indexOf('scholarprod') < 0) {
      clipUrl = 'http://dacadrs.kaist.ac.kr';
    }

    console.log(clipUrl + '/clipreport4/sch_report.jsp?c=' + crfname + '&p=' + param_str, crfname);

    // console.log("hostName...", hostName);  //localhost
    //window.open('//'+clipUrl+'/clipreport4/sti_report.jsp?c=' + crfname + '&p=' + param_str);
    window.top.open(clipUrl + '/clipreport4/sch_report.jsp?c=' + crfname + '&p=' + param_str, crfname);
    //http://143.248.105.161/clipreport4/sti_report_dev.jsp?c=test&p=%EA%B5%AC%EB%B6%84
  }
  
  /**
 *
 *
 * @param {*} crfname  리포트파일명 확장자 빼고
 * @param {*} params : '201601|준석'
 */
function report_show_newtab(crfname, params) {
  var param_str = btoa(encodeURIComponent(params));
  var hostName = location.hostname;
  var clipUrl = 'http://acadrs.kaist.ac.kr';
  if (hostName.indexOf('scholarprod') < 0) {
    clipUrl = 'http://dacadrs.kaist.ac.kr';
  }
  window.open(clipUrl + '/clipreport4/sch_report.jsp?c=' + crfname + '&p=' + param_str,'_blank');

  // console.log("hostName...", hostName);  //localhost
  //window.open('//'+clipUrl+'/clipreport4/sti_report.jsp?c=' + crfname + '&p=' + param_str);
  //http://143.248.105.161/clipreport4/sti_report_dev.jsp?c=test&p=%EA%B5%AC%EB%B6%84
}