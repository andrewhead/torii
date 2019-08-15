import * as React from "react";
import AceEditor from "react-ace";
import { connect } from "react-redux";
import { Path, SnippetId, State } from "santoku-store";
import { getSnippetText, SnippetText } from "./selectors/snippet";

/*
 * Use 'require' instead of 'import' as automatic organization of imports in VSCode puts these
 * statements above the other imports, which need to be run first.
 */
// tslint:disable-next-line: no-var-requires
require("brace/mode/java");
// tslint:disable-next-line: no-var-requires
require("brace/theme/github");

export function Snippet(props: SnippetProps) {
  return (
    <div className="snippet">
      {props.snippetText.paths.map((path: Path) => (
        <AceEditor
          /* TODO set mode based on file extension */
          mode="java"
          theme="github"
          key={path}
          value={props.snippetText.byPath[path].text}
          maxLines={15}
        />
      ))}
    </div>
  );
}

interface SnippetOwnProps {
  id: SnippetId;
}

interface SnippetProps {
  snippetText: SnippetText;
}

export default connect(
  (state: State, ownProps: SnippetOwnProps): SnippetProps => {
    return {
      snippetText: getSnippetText(state.text.present, ownProps.id)
    };
  }
)(Snippet);
