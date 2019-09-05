import { Button, CircularProgress, styled, Theme, withTheme } from "@material-ui/core";
import SubjectIcon from "@material-ui/icons/Subject";
import * as React from "react";
import { connect } from "react-redux";
import { actions, Output, OutputId, State } from "santoku-store";
import { getOutput } from "./selectors/output-button";

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
      {props.output.type === "console" && <SubjectIcon />}
      {props.output.type === "console" && "Add console output"}
      {props.output.type === "html" && "Add HTML output"}
      {props.output.state !== "finished" && <StyledContrastCircularProgress />}
    </Button>
  );
}

const StyledOutputButton = styled(withTheme(OutputButton))(({ theme }) => ({
  fontFamily: theme.typography.button.fontFamily,
  fontSize: theme.typography.button.fontSize
}));

function ContrastCircularProgress(props: ContrastCircularProgressProps) {
  return (
    <CircularProgress
      className={`${props.className !== undefined && props.className}`}
      color="primary"
      size={props.theme !== undefined ? props.theme.typography.button.fontSize : undefined}
    />
  );
}

interface ContrastCircularProgressProps {
  className?: string;
  theme?: Theme;
}

export const StyledContrastCircularProgress = styled(withTheme(ContrastCircularProgress))(
  ({ theme }) => ({
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    /*
     * XXX(andrewhead): May be a hack. Preferred way to set color is to override 'colorPrimary'
     * as described in https://material-ui.com/api/circular-progress/.
     */
    color: theme.palette.getContrastText(theme.palette.primary.main)
  })
);

interface OutputButtonOwnProps {
  id: OutputId;
  cellIndex: number;
}

interface OutputButtonProps extends OutputButtonActions {
  id: OutputId;
  output: Output;
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
    return {
      id: ownProps.id,
      cellIndex: ownProps.cellIndex,
      output: getOutput(state, ownProps.id)
    };
  },
  outputButtonActionCreators
)(StyledOutputButton);
