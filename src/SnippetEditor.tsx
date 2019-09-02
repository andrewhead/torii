import { connect } from "react-redux";
import { Path, SnippetId, State } from "santoku-store";
import CodeEditor from "./CodeEditor";
import { getSnippetEditorProps } from "./selectors/code-editor";
import { CodeEditorProps } from "./selectors/types";

/**
 * Code editor for editing all the code for a snippet from one file.
 */
const SnippetEditor = connect(
  (state: State, ownProps: SnippetEditorOwnProps): CodeEditorProps => ({
    ...getSnippetEditorProps(state, ownProps.snippetId, ownProps.path)
  })
)(CodeEditor);

interface SnippetEditorOwnProps {
  snippetId: SnippetId;
  path: Path;
}

export default SnippetEditor;
