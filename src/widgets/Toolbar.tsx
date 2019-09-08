import Button from "@material-ui/core/Button";
import styled from "@material-ui/core/styles/styled";
import MaterialUiToolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CodeIcon from "@material-ui/icons/Code";
import SaveIcon from "@material-ui/icons/Save";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import UndoIcon from "@material-ui/icons/Undo";
import { saveAs } from "file-saver";
import * as React from "react";
import { connect } from "react-redux";
import { EditorAdapter, requests } from "santoku-editor-adapter";
import { actions, State } from "santoku-store";
import { EditorContext } from "../contexts/editor";
import { GetStateContext } from "../contexts/store";

export function Toolbar(props: ToolbarProps) {
  return (
    <MaterialUiToolbar
      variant="dense"
      className={`${props.className !== undefined && props.className}`}
    >
      <Typography className="title" variant="h6">
        Torii
      </Typography>
      <div className="button-set">
        <GetStateContext.Consumer>
          {getState => (
            <Button
              color="secondary"
              variant="outlined"
              className="action-button textual-action-button"
              onClick={() => {
                props.insertText(getState());
              }}
            >
              <TextFieldsIcon className="action-icon" />
              Add text
            </Button>
          )}
        </GetStateContext.Consumer>
        <EditorContext.Consumer>
          {getEditorAdapter => {
            return (
              <Button
                color="secondary"
                variant="outlined"
                className="action-button textual-action-button"
                onClick={() => {
                  addSnippet(getEditorAdapter);
                }}
              >
                <CodeIcon className="action-icon" />
                Add snippet
              </Button>
            );
          }}
        </EditorContext.Consumer>
        <Button
          color="inherit"
          className="action-button textual-action-button"
          onClick={() => props.undo()}
        >
          <UndoIcon className="action-icon" />
          Undo
        </Button>
      </div>
      <div className="button-set">
        <Button color="inherit" className="action-button" component="label">
          <CloudUploadIcon />
          <input
            id="load-file-input"
            type="file"
            accept=".json"
            onChange={event => load(event, props.setState)}
            style={{ display: "none" } /* Hide the input; it will be rendered as Button */}
          />
        </Button>
        <GetStateContext.Consumer>
          {getState => (
            <Button color="inherit" className="action-button" onClick={() => save(getState())}>
              <SaveIcon />
            </Button>
          )}
        </GetStateContext.Consumer>
      </div>
    </MaterialUiToolbar>
  );
}

function addSnippet(getEditorAdapter: () => EditorAdapter | undefined) {
  const editorAdapter = getEditorAdapter();
  if (editorAdapter !== undefined) {
    editorAdapter.request(requests.insertSnippetRequest());
  }
}

function load(event: React.ChangeEvent<HTMLInputElement>, setState: typeof actions.state.setState) {
  const files = event.target.files;
  if (files !== null && files.length === 1) {
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = loadEvent => {
      if (loadEvent.target !== null) {
        const result = reader.result;
        if (result !== null && typeof result === "string") {
          let state;
          try {
            /*
             * TODO(andrewhead): validate data before loading it.
             * TODO(andrewhead): provide user-friendly error message if load fails.
             */
            state = JSON.parse(result);
          } catch (err) {
            console.error(err);
          }
          setState(state);
        }
      }
    };
    reader.readAsText(file);
  }
}

function save(state: State) {
  const time = new Date().toLocaleTimeString();
  const fileName = `Tutorial ${time}.json`;
  const data = JSON.stringify(state, undefined, 2);
  const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
  saveAs(blob, fileName);
}

interface ToolbarProps extends ToolbarActions {
  className?: string;
}

interface ToolbarActions {
  insertText: typeof actions.cells.insertText;
  setState: typeof actions.state.setState;
  undo: typeof actions.state.undo;
}

const toolbarActionCreators = {
  insertText: actions.cells.insertText,
  setState: actions.state.setState,
  undo: actions.state.undo
};

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  "& .button-set": {
    marginLeft: theme.spacing(4)
  },
  "& .title": {
    flexGrow: 1
  },
  "& .action-icon": {
    marginRight: theme.spacing(1)
  },
  "& .textual-action-button": {
    marginLeft: theme.spacing(1)
  }
}));

export default connect(
  undefined,
  toolbarActionCreators
)(StyledToolbar);
