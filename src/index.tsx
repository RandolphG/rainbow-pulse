import React from "react";
import ReactDOM from "react-dom";
import { Surface } from "gl-react-dom";
import RainbowPulse from "./App";

ReactDOM.render(
  <React.StrictMode>
    <Surface width={400} height={400}>
      <RainbowPulse />
    </Surface>
  </React.StrictMode>,
  document.getElementById("root")
);
