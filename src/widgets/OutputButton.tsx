import Button from "@material-ui/core/Button";
import { Theme } from "@material-ui/core/styles";
import styled from "@material-ui/core/styles/styled";
import withTheme from "@material-ui/core/styles/withTheme";
import SubjectIcon from "@material-ui/icons/Subject";
import * as React from "react";
import { connect } from "react-redux";
import { actions, OutputId, OutputType, State } from "santoku-store";

export function OutputButton(props: OutputButtonProps) {
  return (
    <Button
      variant="text"
      color="secondary"
      className={`output-button ${props.className !== undefined && props.className}`}
      onClick={e => {
        props.insertOutput(props.cellIndex + 1, props.id);
        /*
         * Prevent click from bubbling up to parent, where it would trigger selection of this cell.
         */
        e.stopPropagation();
      }}
    >
      {props.type === "console" && <SubjectIcon className="output-type-icon" />}
      {props.type === "console" && "Add console output"}
      {props.type === "html" && "Add HTML output"}
    </Button>
  );
}

const StyledOutputButton = styled(withTheme(OutputButton))(({ theme }) => ({
  fontFamily: theme.typography.button.fontFamily,
  fontSize: theme.typography.button.fontSize,
  "& .output-type-icon": {
    marginRight: theme.spacing(1)
  }
}));

interface OutputButtonOwnProps {
  id: OutputId;
  cellIndex: number;
}

interface OutputButtonProps extends OutputButtonActions {
  id: OutputId;
  type: OutputType;
  cellIndex: number;
  theme?: Theme;
  className?: string;
}

interface OutputButtonActions {
  insertOutput: typeof actions.cells.insertOutput;
}

const outputButtonActionCreators = {
  insertOutput: actions.cells.insertOutput
};

export default connect(
  (state: State, ownProps: OutputButtonOwnProps) => {
    const output = state.outputs.byId[ownProps.id.snippetId][ownProps.id.commandId];
    return {
      id: ownProps.id,
      cellIndex: ownProps.cellIndex,
      type: output.type
    };
  },
  outputButtonActionCreators
)(StyledOutputButton);
