import { connect } from "react-redux";
import { Path, SnippetId, State } from "santoku-store";
import CodeEditor from "./CodeEditor";
import { getSnapshotEditorProps } from "./selectors/code-editor";
import { CodeEditorProps } from "./selectors/types";

/**
 * Code editor for editing all the code for a snapshot (everything up to and including a snippet)
 * from one file.
 */
const SnippetEditor = connect(
  (state: State, ownProps: SnapshotEditorOwnProps): CodeEditorProps => ({
    ...getSnapshotEditorProps(state, ownProps.snippetId, ownProps.path)
  })
)(CodeEditor);

interface SnapshotEditorOwnProps {
  snippetId: SnippetId;
  path: Path;
}

export default SnippetEditor;
