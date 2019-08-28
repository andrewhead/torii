import * as React from "react";
import { connect } from "react-redux";
import { CommandId, Output, SnippetId, State } from "santoku-store";
import { getOutput } from "./selectors/output-button";

export function OutputButton(props: OutputButtonProps) {
  return <div className={`output-button command-state-${props.output.state}`} />;
}

interface OutputButtonOwnProps {
  snippetId: SnippetId;
  commandId: CommandId;
}

interface OutputButtonProps {
  output: Output;
}

export default connect(
  (state: State, ownProps: OutputButtonOwnProps): OutputButtonProps => {
    return {
      output: getOutput(state, ownProps.snippetId, ownProps.snippetId)
    };
  }
)(OutputButton);
