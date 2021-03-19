import React from "react";
import { useState } from "react";
import { TextField } from "@material-ui/core";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Fab from "@material-ui/core/Fab";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";

const VoiceInput = ({ onChange }) => {
  const [state, setState] = useState("");
  const [toggle, setToggle] = useState(true);

  const commands = [
    {
      command: "*",
      callback: (text) => onChange(text.trim().toLowerCase()),
    },
    {
      command: "Назад",
      callback: () => onChange(""),
    },
  ];

  const { transcript } = useSpeechRecognition({ commands });

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  const handleChange = (event) => {
    const text = event.target.value.toLowerCase();
    setState(text);
    onChange(text);
  };

  const handleOn = () => {
    setToggle(!toggle);
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleOff = () => {
    setToggle(!toggle);
    SpeechRecognition.stopListening();
  };

  return (
    <>
      <TextField
        value={state}
        type="text"
        label="Поиск"
        onChange={(event) => handleChange(event)}
      />
      <Fab
        color="primary"
        aria-label="start"
        size="small"
        component="span"
        onClick={handleOn} //() => SpeechRecognition.startListening({ continuous: true })}
        disabled={!toggle}
      >
        <MicIcon />
      </Fab>
      <Fab
        color="secondary"
        aria-label="stop"
        size="small"
        component="span"
        onClick={handleOff} // SpeechRecognition.stopListening}
        disabled={toggle}
      >
        <MicOffIcon />
      </Fab>
      <span>{transcript.split(" ").pop()}</span>

      {/* <button onClick={() => SpeechRecognition.startListening({ continuous: true })}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button> */}
    </>
  );
};

export default VoiceInput;
