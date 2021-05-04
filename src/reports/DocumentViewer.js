// @flow

import * as React from "react";
import { useEffect } from "react";
import SSReport from "./ReportService";

// interface Props {
//   docTemplate: IDocTemplate,
//   data: any;
// }

// export interface IDocTemplate extends IDBItem {
//   userId: number;
//   projectId: number;

//   name: string;
//   numbered: boolean;
//   step?: number;
//   suffix?: string;
//   firstNumber?: number;
//   toNull?: string;
//   filename: string;
//   data: DocTemplateDataType,
// }

// class DocumentViewer extends React.Component {
//   componentDidMount() {
//     const { docTemplate, data } = this.props;

//     console.log("DATA", data);
//     console.log("template", docTemplate);
//     const reporter = new SSReport();
//     reporter.setTemplate(docTemplate.filename);

//     // const dataBuilder = new ReportDataService(doc, docTemplate);
//     // const data = dataBuilder.buildByOrder(order);

//     reporter.setTemplateData(data);
//     reporter.renderViewer();
//   }

//   componentWillUnmount() {
//     console.log("will unmount");
//   }

//   render() {
//     return <section id="viewer" />;
//   }
// }

// export default DocumentViewer;

const DocumentViewer = ({ docTemplate, data }) => {
  useEffect(() => {
    const reporter = new SSReport();
    reporter.setTemplate(docTemplate.filename);
    reporter.setTemplateData(data);
    reporter.renderViewer();
    console.log("reporter", reporter);
    console.log("template", docTemplate);
    console.log("data", data);
  }, [docTemplate, data]);

  return (
    <div>
      <section id="viewer" />
    </div>
  );
};

export default DocumentViewer;

// class DocumentViewer extends React.Component {
//   render() {
//     return <div id="viewer"></div>;
//   }

//   componentDidMount() {
//     console.log("Loading Viewer view");

//     console.log("Creating the report viewer with default options");
//     var viewer = new window.Stimulsoft.Viewer.StiViewer(null, "StiViewer", false);

//     console.log("Creating a new report instance");
//     var report = new window.Stimulsoft.Report.StiReport();

//     console.log("Load report from url");
//     report.loadFile("/doc-templates/bill2.mrt");

//     console.log(
//       "Assigning report to the viewer, the report will be built automatically after rendering the viewer"
//     );
//     viewer.report = report;

//     console.log(report);
//     console.log("Rendering the viewer to selected element");
//     viewer.renderHtml("viewer");
//   }
// }

// export default DocumentViewer;
