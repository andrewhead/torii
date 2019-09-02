import { connect } from "react-redux";
import { Path, SnippetId, State } from "santoku-store";
import CodeEditor from "./CodeEditor";
import { getSnippetEditorProps } from "./selectors/snippet";

/**
 * Code editor for editing all the code for a snippet from one file.
 */
export const SnippetEditor = connect((state: State, ownProps: SnippetEditorOwnProps) => ({
  ...getSnippetEditorProps(state.undoable.present, ownProps.snippetId, ownProps.path)
}))(CodeEditor);

interface SnippetEditorOwnProps {
  snippetId: SnippetId;
  path: Path;
}

export default SnippetEditor;
