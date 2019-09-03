import styled from "@material-ui/core/styles/styled";
import withTheme from "@material-ui/core/styles/withTheme";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Path, SnippetId, State } from "santoku-store";
import CodeEditor from "./CodeEditor";
import { getSnapshotEditorProps, getSnippetRangeDecorations } from "./selectors/snapshot-editor";
import { BaseSnapshotEditorProps, SnippetOffsets } from "./selectors/types";
import {
  ContentWidgetPositionPreference,
  IContentWidget,
  IStandaloneCodeEditor,
  MonacoApiType
} from "./types/monaco";

/**
 * Code editor for editing all the code for a snapshot (everything up to and including a snippet)
 * from one file.
 */
export function SnapshotEditor(props: SnapshotEditorProps) {
  const editorRef = useRef<IStandaloneCodeEditor>();
  const monacoApiRef = useRef<MonacoApiType>();
  const [snippetRangeDecorations, setSnippetRangeDecorations] = useState<string[]>([]);
  const [snippetIndexWidgets, setSnippetIndexWidgets] = useState<IContentWidget[]>([]);

  useEffect(() => {
    if (props.hidden !== true) {
      updateSnippetRangeDecorations();
      updateSnippetIndexWidgets();
    }
  }, [props.hidden]);

  useEffect(() => {
    updateSnippetRangeDecorations();
    updateSnippetIndexWidgets();
  }, [props.snippetOffsets]);

  function updateSnippetRangeDecorations() {
    if (props.hidden === true || editorRef.current === undefined) {
      return;
    }
    const editor = editorRef.current;
    const newDecorations = getSnippetRangeDecorations(props.snippetOffsets, props.snippetId);
    setSnippetRangeDecorations(editor.deltaDecorations(snippetRangeDecorations, newDecorations));
  }

  function updateSnippetIndexWidgets() {
    if (props.hidden === true || editorRef.current === undefined) {
      return;
    }
    const editor = editorRef.current;
    const model = editor.getModel();
    if (model === null) {
      return;
    }
    for (const oldWidget of snippetIndexWidgets) {
      editor.removeContentWidget(oldWidget);
    }
    const newWidgets = getSnippetIndexContentWidgets(props.snippetOffsets, model.getLineCount());
    setSnippetIndexWidgets(newWidgets);
    for (const newWidget of newWidgets) {
      editor.addContentWidget(newWidget);
    }
  }

  return <CodeEditor {...{ ...props, editorRef, monacoApiRef }} />;
}

interface SnapshotEditorProps extends BaseSnapshotEditorProps {
  snippetId: SnippetId;
  hidden?: boolean;
}

interface SnapshotEditorOwnProps {
  snippetId: SnippetId;
  path: Path;
  hidden?: boolean;
}

export function getSnippetIndexContentWidgets(
  snippetOffsets: SnippetOffsets,
  maxLineNumber: number
): IContentWidget[] {
  return snippetOffsets.map(
    (offset, i): IContentWidget => {
      const nextOffset = snippetOffsets[i + 1];
      const lineNumber = nextOffset !== undefined ? nextOffset.line - 1 : maxLineNumber;
      return {
        allowEditorOverflow: false,
        getId: () => {
          return `${offset.snippetId}-${offset.line}`;
        },
        getDomNode: () => {
          const node = document.createElement("div");
          node.classList.add("snippet-index-label");
          node.innerHTML = `<code>← snippet ${offset.snippetIndex + 1}</code>`;
          return node;
        },
        getPosition: () => {
          return {
            position: { lineNumber, column: Number.POSITIVE_INFINITY },
            preference: [ContentWidgetPositionPreference.EXACT]
          };
        }
      };
    }
  );
}

const StyledSnapshotEditor = styled(withTheme(SnapshotEditor))(({ theme }) => ({
  "& .snippet-range": {
    "&.past-snippet": {
      backgroundColor: theme.palette.primaryScale[200],
      /*
       * Right behind the selection background color. This also causes a small visual glitch where
       * a box for the cursor appears in front of this background at the edge of the selection. I
       * don't know how to fix this, as I couldn't find a way to make Monaco backgrounds transparent.
       */
      zIndex: -1
    }
  },
  "& .snippet-index-label": {
    "& code": {
      fontFamily: theme.typography.code.fontFamily + " !important",
      fontSize: theme.typography.code.fontSize,
      fontStyle: "italic",
      whiteSpace: "nowrap"
    },
    marginLeft: theme.spacing(3),
    opacity: 0.4
  }
}));

export default connect(
  (state: State, ownProps: SnapshotEditorOwnProps): SnapshotEditorProps => ({
    ...getSnapshotEditorProps(state, ownProps.snippetId, ownProps.path),
    snippetId: ownProps.snippetId,
    hidden: ownProps.hidden
  })
)(StyledSnapshotEditor);
