import * as React from "react";
import { connect } from "react-redux";
import { Path, SnippetId, State } from "santoku-store";
import { CodePreview } from "./CodePreview";
import { getSnippetText } from "./selectors/snippet";
import { SnippetText } from "./selectors/types";

/**
 * Will contain multiple editors, if snippet contains code for multiple paths.
 */
export function Snippet(props: SnippetProps) {
  return (
    <div className="snippet">
      {props.snippetText.paths.map((path: Path) => (
        <CodePreview key={path} path={path} {...props.snippetText.byPath[path]} />
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
