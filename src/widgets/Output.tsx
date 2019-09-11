import _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { Output as OutputState, OutputId, State } from "santoku-store";
import { getOutput } from "../selectors/output-button";
import ConsoleOutput from "./ConsoleOutput";
import HtmlOutput from "./HtmlOutput";

export function Output(props: OutputProps) {
  return (
    <div className={`output`}>
      {props.output.type === "console" && <ConsoleOutput output={props.output} />}
      {props.output.type === "html" && <HtmlOutput output={props.output} />}
    </div>
  );
}

interface OutputOwnProps {
  id: OutputId;
  cellIndex: number;
}

interface OutputProps {
  output: OutputState;
}

export default connect(
  (state: State, ownProps: OutputOwnProps): OutputProps => {
    /*
     * TODO(andrewhead): Clean this up, figure out better default behavior when no output found.
     */
    const emptyOutput: OutputState = {
      commandId: ownProps.id.commandId,
      state: "finished",
      type: "console"
    };
    return {
      output: getOutput(state, ownProps.id.commandId, ownProps.cellIndex) || emptyOutput
    };
  },
  undefined,
  undefined,
  { pure: true, areStatePropsEqual: _.isEqual }
)(Output);
