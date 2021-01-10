import React, { useState } from "react";

import { PartySuggestions } from "react-dadata";
import { FioSuggestions } from "react-dadata";
import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";

// import { Row, Col } from "reactstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import contentData from "../utils/contentData";

const Orders = () => {
  const [valueParty, setValueParty] = useState();
  const [valueAddress, setValueAddress] = useState();
  const [valueFio, setValueFio] = useState();
  const API_KEY = "02698293a1c705c3241ff4206710c67c84eeff56";

  return (
    <div>
      <PartySuggestions token={API_KEY} value={valueParty} onChange={setValueParty} />;
      <AddressSuggestions token={API_KEY} value={valueAddress} onChange={setValueAddress} />;
      <FioSuggestions token={API_KEY} value={valueFio} onChange={setValueFio} />;
    </div>
  );
};

export default Orders;
