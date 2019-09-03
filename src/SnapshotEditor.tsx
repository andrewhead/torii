import React from "react";
import { connect } from "react-redux";
import { Path, SnippetId, State } from "santoku-store";
import CodeEditor from "./CodeEditor";
import { getSnapshotEditorProps } from "./selectors/snapshot-editor";
import { SnapshotEditorProps, SnippetOffsets } from "./selectors/types";
import { ContentWidgetPositionPreference, IContentWidget } from "./types/monaco";

/**
 * Code editor for editing all the code for a snapshot (everything up to and including a snippet)
 * from one file.
 */
export function SnapshotEditor(props: SnapshotEditorProps) {
  return <CodeEditor {...props} />;
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
      const lineNumber = nextOffset !== undefined ? nextOffset.line : maxLineNumber;
      return {
        allowEditorOverflow: true,
        getId: () => {
          return `${offset.snippetId}-${offset.line}`;
        },
        getDomNode: () => {
          const node = document.createElement("div");
          node.classList.add("snippet-index-label");
          node.innerHTML = "<code>&lt;- snippet 1</code>";
          return node;
        },
        getPosition: () => {
          return {
            position: { lineNumber, column: Number.POSITIVE_INFINITY },
            preference: [
              ContentWidgetPositionPreference.ABOVE,
              ContentWidgetPositionPreference.BELOW
            ]
          };
        }
      };
    }
  );
}

export default connect((state: State, ownProps: SnapshotEditorOwnProps) => ({
  ...getSnapshotEditorProps(state, ownProps.snippetId, ownProps.path),
  hidden: ownProps.hidden
}))(SnapshotEditor);
