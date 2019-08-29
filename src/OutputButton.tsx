import { Button, CircularProgress, styled, Theme, withTheme } from "@material-ui/core";
import SubjectIcon from "@material-ui/icons/Subject";
import * as React from "react";
import { connect } from "react-redux";
import { actions, Output, OutputId, State, store } from "santoku-store";
import { getOutput } from "./selectors/output-button";

export function OutputButton(props: OutputButtonProps) {
  return (
    <Button
      variant="contained"
      color="secondary"
      className={`output-button ${props.className !== undefined && props.className}`}
      onClick={() => store.dispatch(actions.cells.insertOutput(props.id, 0))}
    >
      {props.output.type === "console" && "Console output"}
      {props.output.type === "html" && "HTML"}
      {props.output.state !== "finished" && <StyledContrastCircularProgress />}
      {props.output.type === "console" && <SubjectIcon />}
    </Button>
  );
}

const StyledOutputButton = styled(withTheme(OutputButton))(({ theme }) => ({
  padding: theme.spacing(1),
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

const StyledContrastCircularProgress = styled(withTheme(ContrastCircularProgress))(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  /*
   * XXX(andrewhead): May be a hack. Preferred way to set color is to override 'colorPrimary'
   * as described in https://material-ui.com/api/circular-progress/.
   */
  color: theme.palette.getContrastText(theme.palette.primary.main)
}));

interface OutputButtonOwnProps {
  id: OutputId;
}

interface OutputButtonProps {
  id: OutputId;
  output: Output;
  theme?: Theme;
  className?: string;
}

export default connect(
  (state: State, ownProps: OutputButtonOwnProps): OutputButtonProps => {
    return {
      id: ownProps.id,
      output: getOutput(state, ownProps.id)
    };
  }
)(StyledOutputButton);
