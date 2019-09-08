import { connect } from "react-redux";
import { Path, SnippetId, State } from "santoku-store";
import CodeEditor, { CodeEditorOwnProps } from "./CodeEditor";
import { getSnippetEditorProps } from "../selectors/snippet-editor";

/**
 * Code editor for editing all the code for a snippet from one file.
 */
const SnippetEditor = connect(
  (state: State, ownProps: SnippetEditorOwnProps): CodeEditorOwnProps => ({
    ...getSnippetEditorProps(state, ownProps.snippetId, ownProps.path),
    hidden: ownProps.hidden
  })
)(CodeEditor);

interface SnippetEditorOwnProps {
  snippetId: SnippetId;
  path: Path;
  hidden?: boolean;
}

export default SnippetEditor;
