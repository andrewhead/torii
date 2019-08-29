import * as React from "react";
import { connect } from "react-redux";
import { actions, Output, OutputId, State, store } from "santoku-store";
import { getOutput } from "./selectors/output-button";

export function OutputButton(props: OutputButtonProps) {
  return (
    <div
      className={`output-button command-state-${props.output.state}`}
      onClick={() => store.dispatch(actions.cells.insertOutput(props.id, 0))}
    >
      {props.output.type}
    </div>
  );
}

interface OutputButtonOwnProps {
  id: OutputId;
}

interface OutputButtonProps {
  id: OutputId;
  output: Output;
}

export default connect(
  (state: State, ownProps: OutputButtonOwnProps): OutputButtonProps => {
    return {
      id: ownProps.id,
      output: getOutput(state, ownProps.id)
    };
  }
)(OutputButton);
