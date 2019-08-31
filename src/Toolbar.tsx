import Button from "@material-ui/core/Button";
import styled from "@material-ui/core/styles/styled";
import MaterialUiToolbar from "@material-ui/core/Toolbar";
import CodeIcon from "@material-ui/icons/Code";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import * as React from "react";
import { actions, store } from "santoku-store";

export function Toolbar(props: ToolbarProps) {
  return (
    <MaterialUiToolbar
      variant="dense"
      className={`${props.className !== undefined && props.className}`}
    >
      <Button
        color="inherit"
        className="action-button"
        onClick={() => {
          store.dispatch(actions.cells.insertText(store.getState()));
        }}
      >
        <TextFieldsIcon className="action-icon" />
        Add text
      </Button>
      <Button color="inherit" className="action-button">
        <CodeIcon className="action-icon" />
        Add snippet
      </Button>
    </MaterialUiToolbar>
  );
}

interface ToolbarProps {
  className?: string;
}

export default styled(Toolbar)(({ theme }) => ({
  margin: "0 auto",
  "& .action-icon": {
    marginRight: theme.spacing(1)
  },
  "& .action-button": {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1)
  }
}));
