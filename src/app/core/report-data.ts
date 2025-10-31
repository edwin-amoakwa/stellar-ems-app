
export class ReportData {

  reportTitle = "Report Viewer";
  showReportViewer: boolean = false;
  pdfReportData;

  reportDataObject;

  public showPdfReport(reportTitle, data) 
  {
    if (reportTitle) {
      this.reportTitle = reportTitle;
    }

    this.pdfReportData = `data:application/pdf;base64,${data}`;

    this.showReportViewer = true;
  }


}