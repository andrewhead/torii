import styled from "@material-ui/core/styles/styled";
import withTheme from "@material-ui/core/styles/withTheme";
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Path, SnippetId, State } from "torii-store";
import {
  getSelectedChunkVersionDecorations,
  getSnapshotEditorProps,
  getSnippetRangeDecorations
} from "../selectors/snapshot-editor";
import { SnapshotEditorBaseProps, SnippetOffsets } from "../selectors/types";
import {
  ContentWidgetPositionPreference,
  IContentWidget,
  IStandaloneCodeEditor,
  MonacoApiType
} from "../types/monaco";
import CodeEditor from "./CodeEditor";
import LinkToggle from "./LinkToggle";

/**
 * Code editor for editing all the code for a snapshot (everything up to and including a snippet)
 * from one file.
 */
export function SnapshotEditor(props: SnapshotEditorProps) {
  const editorRef = useRef<IStandaloneCodeEditor>();
  const monacoApiRef = useRef<MonacoApiType>();
  const linkWidgetRef = useRef<HTMLDivElement>(null);
  const selectedChunkDecorations = useRef<string[]>([]);
  const snippetRangeDecorations = useRef<string[]>([]);
  const snippetIndexWidgets = useRef<IContentWidget[]>([]);

  useEffect(() => {
    if (props.hidden !== true) {
      updateSnippetRangeDecorations();
      updateSelectedChunkDecorations();
      // updateSnippetIndexWidgets();
      updateLinkToggleWidget();
    }
  }, [props.hidden]);

  useEffect(() => {
    updateSnippetRangeDecorations();
    // updateSnippetIndexWidgets();
  }, [props.snippetOffsets]);

  useEffect(() => {
    updateSelectedChunkDecorations();
    updateLinkToggleWidget();
  }, [props.selectedChunkVersionId, props.chunkVersionOffsets]);

  function updateSnippetRangeDecorations() {
    if (props.hidden === true || editorRef.current === undefined) {
      return;
    }
    const editor = editorRef.current;
    const newDecorations = getSnippetRangeDecorations(
      props.snippetOffsets,
      props.snippetId
    );
    snippetRangeDecorations.current = editor.deltaDecorations(
      snippetRangeDecorations.current,
      newDecorations
    );
  }

  function updateSelectedChunkDecorations() {
    if (props.hidden === true || editorRef.current === undefined) {
      return;
    }
    const editor = editorRef.current;
    const newDecorations = getSelectedChunkVersionDecorations(
      props.selectedChunkVersionId,
      props.chunkVersionOffsets
    );
    selectedChunkDecorations.current = editor.deltaDecorations(
      selectedChunkDecorations.current,
      newDecorations
    );
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
    for (const oldWidget of snippetIndexWidgets.current) {
      editor.removeContentWidget(oldWidget);
    }
    const newWidgets = getSnippetIndexContentWidgets(
      props.snippetOffsets,
      model.getLineCount()
    );
    snippetIndexWidgets.current = newWidgets;
    for (const newWidget of newWidgets) {
      editor.addContentWidget(newWidget);
    }
  }

  function updateLinkToggleWidget() {
    if (
      props.hidden === true ||
      editorRef.current === undefined ||
      props.selectedChunkVersionId === undefined ||
      linkWidgetRef.current === null
    ) {
      return;
    }
    const editor = editorRef.current;
    const selectionChunkVersionLine = props.chunkVersionOffsets
      .filter(offset => offset.chunkVersionId === props.selectedChunkVersionId)
      .map(offset => offset.line)[0];
    if (selectionChunkVersionLine !== undefined) {
      const lineTop = editor.getTopForLineNumber(selectionChunkVersionLine);
      linkWidgetRef.current.style.top = `${lineTop}px`;
    }
  }

  return (
    <div hidden={props.hidden}>
      <CodeEditor {...{ ...props, editorRef, monacoApiRef }} />
      <div ref={linkWidgetRef} style={{ position: "absolute", right: 0 }}>
        {props.selectedChunkVersionId !== undefined && (
          <LinkToggle
            snippetId={props.snippetId}
            chunkVersionId={props.selectedChunkVersionId}
          />
        )}
      </div>
    </div>
  );
}

interface SnapshotEditorProps extends SnapshotEditorBaseProps {
  snippetId: SnippetId;
  hidden?: boolean;
}

interface SnapshotEditorOwnProps {
  snippetId: SnippetId;
  path: Path;
  hidden?: boolean;
}

// export function getSnippetBoundaryViewZones(snippetOffsets: SnippetOffsets) {}

export function getSnippetIndexContentWidgets(
  snippetOffsets: SnippetOffsets,
  maxLineNumber: number
): IContentWidget[] {
  return snippetOffsets.map(
    (offset, i): IContentWidget => {
      const nextOffset = snippetOffsets[i + 1];
      const lineNumber =
        nextOffset !== undefined ? nextOffset.line - 1 : maxLineNumber;
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
  "& .snippet-index-label": {
    "& code": {
      fontFamily: theme.typography.code.fontFamily + " !important",
      fontSize: theme.typography.code.fontSize,
      fontStyle: "italic",
      whiteSpace: "nowrap"
    },
    marginLeft: theme.spacing(3),
    opacity: 0.4
  },
  "& .selected-chunk-version-top-boundary": {
    borderTopColor: theme.palette.secondaryScale[100],
    borderBottomWidth: theme.shape.codeLineBorderWidth,
    borderTopStyle: "solid"
  },
  /**
   * Set background to transparent, as otherwise we see weird cells of white on top of chunks for
   * which we've set the background color.
   */
  "& .monaco-editor-background": {
    background: "none"
  },
  "& .selected-chunk-version-body": {
    backgroundColor: theme.palette.secondaryScale[50],
    /*
     * Right behind the selection background color.
     */
    zIndex: -1
  },
  "& .selected-chunk-version-bottom-boundary": {
    borderBottomColor: theme.palette.secondaryScale[100],
    borderBottomWidth: theme.shape.codeLineBorderWidth,
    borderBottomStyle: "solid"
  },
  "& .snippet-range": {
    "&.past-snippet": {
      backgroundColor: theme.palette.primaryScale[100],
      /*
       * Right behind the highlights for the selected chunk.
       */
      zIndex: -2
    }
  }
}));

export default connect(
  (state: State, ownProps: SnapshotEditorOwnProps): SnapshotEditorProps => ({
    ...getSnapshotEditorProps(state, ownProps.snippetId, ownProps.path),
    snippetId: ownProps.snippetId,
    hidden: ownProps.hidden
  })
)(StyledSnapshotEditor);
