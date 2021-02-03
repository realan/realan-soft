// @flow

const { Stimulsoft } = window;
Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("/fonts/arial.ttf", "Arial");


class SSReport {

  constructor() {
    if (!SSReport.instance) {
      this.report = new Stimulsoft.Report.StiReport();
      SSReport.instance = this;
    }

    return SSReport.instance;
  }

  setTemplate(templateName) {
    this.report.loadFile(`/doc-templates/${templateName}`);
  }

  setTemplateData(data) {
    const dataSet = new Stimulsoft.System.Data.DataSet('SimpleDataSet');
    dataSet.readJson(data);
    // Remove all connections from the report template
    this.report.dictionary.databases.clear();
    this.report.regData(dataSet.dataSetName, '', dataSet);
  }

  renderViewer() {
    const viewer = new Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);
    viewer.report = this.report;
    viewer.renderHtml('viewer');
  }

  makeFormFile() {
    this.report.render();
    const settings = new Stimulsoft.Report.Export.StiPdfExportSettings();

    settings.embeddedFonts = true;
    // settings.useUnicode = true;

    const service = new Stimulsoft.Report.Export.StiPdfExportService();
    const stream = new Stimulsoft.System.IO.MemoryStream();
    service.exportTo(this.report, stream, settings);
    let data = stream.toArray();
    data = new Uint8Array(data);
    const blob = new Blob([data], {type: "application/pdf"});
    return new File([blob], 'doc.pdf', { type: "application/pdf" });
  }
}

export default SSReport;