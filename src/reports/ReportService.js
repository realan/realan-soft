// @flow

const { Stimulsoft } = window;
Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("/fonts/arial.ttf", "Arial");
Stimulsoft.Base.StiLicense.key =
  "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHnmbEki2b7c7g2avDGmu47FI5I0xOWWM4x+z6uEC0sv8AB9EJ" +
  "7m/VJr/sXFBGoGoxjmn2f8sr9agafv9J227YrRuXREgeUnrsq2lYIfKjtkk7QUyfQAjzi/iAlsgeSraQHMgrXUGGJ+" +
  "cUTCDFCULiq8ZeT4Q3FeiVGLsllhmiSVs/07HglqNc+usFjs5fRz+vZjyXt6fXKaEz/VovJi3GA1lJzwptooIfZqdH" +
  "9CBtbH0dMriRPinmBsePbzcl4yAq+pEALkKnDJtm/6E2t/O0nhMLkM++qTY+pqcc/Akp0PA84+JDNO26Ob8yXHipg6" +
  "zGHZp0kkaUrkP/nacJDPrsE+latg4z4wvRHlrBz6GKYh6gUqcC5hdK9iB1Bf650R0V9M/dx08gPAzwbzJsNNZoquwg" +
  "iG3UmrDH3/HQbAPUV0e7NGakENpg9UoaDBuWP4MAgmimvsguADREE2LgwImsUKIk7df0YsZkR8ZQ+apStrAX/+jm7Y" +
  "b2Hanq0s2A0KZsm6JewOWWeek4WpCqVSY9QZ";

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
    const dataSet = new Stimulsoft.System.Data.DataSet("SimpleDataSet");
    dataSet.readJson(data);
    // Remove all connections from the report template
    this.report.dictionary.databases.clear();
    this.report.regData(dataSet.dataSetName, "", dataSet);
  }

  renderViewer() {
    const viewer = new Stimulsoft.Viewer.StiViewer(null, "StiViewer", false);
    viewer.report = this.report;
    viewer.renderHtml("viewer");
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
    const blob = new Blob([data], { type: "application/pdf" });
    return new File([blob], "doc.pdf", { type: "application/pdf" });
  }
}

export default SSReport;
