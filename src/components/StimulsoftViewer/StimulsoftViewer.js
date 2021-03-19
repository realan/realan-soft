import React from "react";

class StimulsoftViewer extends React.Component {
  render() {
    return <div id="viewerContent"></div>;
  }

  componentWillMount() {
    var report = Stimulsoft.Report.StiReport.createNewReport();
    report.loadFile("reports/ruBill.mrt");

    var options = new Stimulsoft.Viewer.StiViewerOptions();
    this.viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    this.viewer.report = report;
  }

  componentDidMount() {
    this.viewer.renderHtml("viewerContent");
  }
}

export default StimulsoftViewer;
