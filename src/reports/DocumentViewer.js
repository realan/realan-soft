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


const DocumentViewer = ({docTemplate, data}) => {
  
  useEffect( () => {
    const reporter = new SSReport();
    reporter.setTemplate(docTemplate.filename);
    reporter.setTemplateData(data);
    reporter.renderViewer();
    console.log("reporter", reporter)
  },[])

  

  return (
    <div>
      <section id="viewer" />
    </div>
  );

    
}

export default DocumentViewer;

