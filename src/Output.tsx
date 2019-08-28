import * as React from "react";
import { connect } from "react-redux";
import { CommandId, Output as OutputState, SnippetId, State } from "santoku-store";
import { ConsoleOutput } from "./ConsoleOutput";
import { getOutput } from "./selectors/output-button";

export function Output(props: OutputProps) {
  return (
    <div className={`output command-state-${props.output.state}`}>
      {props.output.type === "console" && <ConsoleOutput output={props.output} />}
    </div>
  );
}

interface OutputOwnProps {
  snippetId: SnippetId;
  commandId: CommandId;
}

interface OutputProps {
  output: OutputState;
}

export default connect(
  (state: State, ownProps: OutputOwnProps): OutputProps => {
    return {
      output: getOutput(state, ownProps.snippetId, ownProps.snippetId)
    };
  }
)(Output);
