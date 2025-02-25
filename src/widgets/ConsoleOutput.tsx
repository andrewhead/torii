import { LinearProgress, styled } from "@material-ui/core";
import * as React from "react";
import { useEffect, useRef } from "react";
import { Output } from "torii-store";

export function ConsoleOutput(props: ConsoleOutputProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current !== null && props.output.log !== undefined) {
      if (preRef.current.textContent !== props.output.log.contents) {
        preRef.current.textContent = props.output.log.contents;
      }
    }
  });

  return (
    <div
      className={`console-output ${props.className !== undefined &&
        props.className}`}
    >
      <div className="buffer">
        <pre ref={preRef} />
        {props.output.state !== "finished" && (
          <LinearProgress className="progress" color="secondary" />
        )}
      </div>
    </div>
  );
}

interface ConsoleOutputProps {
  output: Output;
  className?: string;
}

export default styled(ConsoleOutput)(({ theme }) => {
  return {
    "& .buffer": {
      backgroundColor: theme.palette.primaryScale[900],
      borderRadius: theme.shape.borderRadius
    },
    "& pre": {
      margin: 0,
      whiteSpace: "pre-wrap",
      maxHeight: "500px",
      overflowY: "scroll",
      padding: theme.spacing(2) + "px !important",
      fontFamily: theme.typography.code.fontFamily + " !important",
      fontSize: theme.typography.code.fontSize,
      color: theme.palette.getContrastText(theme.palette.primaryScale[900])
    },
    position: "relative",
    "& .progress": {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: "100%"
    }
  };
});
