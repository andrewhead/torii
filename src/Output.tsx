import * as React from "react";
import { connect } from "react-redux";
import { Output as OutputState, OutputId, State } from "santoku-store";
import ConsoleOutput from "./ConsoleOutput";
import { getOutput } from "./selectors/output-button";

export function Output(props: OutputProps) {
  return (
    <div className={`output`}>
      {props.output.type === "console" && <ConsoleOutput output={props.output} />}
    </div>
  );
}

interface OutputOwnProps {
  id: OutputId;
}

interface OutputProps {
  output: OutputState;
}

export default connect(
  (state: State, ownProps: OutputOwnProps): OutputProps => {
    return {
      output: getOutput(state, ownProps.id)
    };
  }
)(Output);
