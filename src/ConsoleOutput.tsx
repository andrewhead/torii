import { styled } from "@material-ui/core";
import * as React from "react";
import { useEffect, useRef } from "react";
import { Output } from "santoku-store";

export function ConsoleOutput(props: ConsoleOutputProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current !== null && props.output.log !== undefined) {
      preRef.current.textContent = props.output.log.contents;
    }
  });

  return (
    <div className={`console-output ${props.className !== undefined && props.className}`}>
      <pre ref={preRef} />
    </div>
  );
}

interface ConsoleOutputProps {
  output: Output;
  className?: string;
}

export default styled(ConsoleOutput)(({ theme }) => ({
  "& pre": {
    fontFamily: theme.typography.code.fontFamily + " !important",
    fontSize: theme.typography.code.fontSize,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.grey[100],
    padding: theme.spacing(1) + "px !important",
    /*
     * TODO(andrewhead): Determine automatically from Monaco margin.
     */
    marginLeft: "85px"
  }
}));
