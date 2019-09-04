import LinearProgress from "@material-ui/core/LinearProgress";
import styled from "@material-ui/core/styles/styled";
import React from "react";
import { Output } from "santoku-store";
import HtmlPreview from "./HtmlPreview";

export function HtmlOutput(props: HtmlOutputProps) {
  return (
    <div
      className={`html-output
        ${props.className !== undefined && props.className}
        state-${props.output.state}`}
    >
      <HtmlPreview className="html-preview" html={props.output.value} />
      {props.output.state !== "finished" && (
        <div className="progress-container">
          <p>generating output...</p>
          <LinearProgress className="progress" color="secondary" />
        </div>
      )}
    </div>
  );
}

interface HtmlOutputProps {
  output: Output;
  className?: string;
}

export default styled(HtmlOutput)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  "&:not(.state-finished)": {
    "& .html-preview": {
      opacity: 0.7
    }
  },
  "& .progress-container p": {
    textAlign: "center"
  },
  position: "relative",
  "& .progress": {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%"
  }
}));
