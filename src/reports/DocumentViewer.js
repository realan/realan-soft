// @flow

import * as React from "react";
import { useState, useEffect } from "react";
import SSReport from "./ReportService";
import SendMail from "components/SendMail/SendMail";

const DocumentViewer = ({ docTemplate, data }) => {
  // let blob = new Blob();
  let document = "";

  const reporter = new SSReport();
  const [attach, setAttach] = useState(document);

  useEffect(() => {
    reporter.setTemplate(docTemplate.filename);
    reporter.setTemplateData(data);
    reporter.renderViewer();
    let file = reporter.makeFormFile();
    document = getBase64(file);
    console.log("document", document);
    // console.log("DOCUMENT VIEWER data", data);
  }, [docTemplate, data]);

  useEffect(() => {
    console.log("document", document);
    setAttach(document);
  }, [document]);

  function getBase64(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      document = reader.result;
      console.log("document", document);
      // setAttach(document);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };

    return document;
  }

  const handleClick = () => {
    setAttach(document);
    // let file = reporter.makeFormFile();
    // setFile(file);
    // getBase64(file);
    // console.log("file", file);
    // console.log("attachment", attachment);
    // setAttach(attachment);
    // reporter.consoleInfo();
  };

  return (
    <div>
      <button onClick={handleClick}>SendDoc</button>
      <section id="viewer" />
      <SendMail attachment={attach} />
    </div>
  );
};

export default DocumentViewer;
