import * as React from "react";
import { Output } from "santoku-store";

export function ConsoleOutput(props: ConsoleOutputProps) {
  return (
    <div className="console-output">
      {props.output.log !== undefined && props.output.log.contents}
    </div>
  );
}

interface ConsoleOutputProps {
  output: Output;
}
