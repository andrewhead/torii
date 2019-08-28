import * as React from "react";
import { connect } from "react-redux";
import { Path, SnippetId, State } from "santoku-store";
import { CodePreview } from "./CodePreview";
import OutputPalette from "./OutputPalette";
import { getSnippetText } from "./selectors/snippet";
import { SnippetText } from "./selectors/types";

/**
 * Will contain multiple editors, if snippet contains code for multiple paths.
 */
export function Snippet(props: SnippetProps) {
  return (
    <div className="snippet">
      <div className="code-previews">
        {props.snippetText.paths.map((path: Path) => (
          <CodePreview key={path} path={path} {...props.snippetText.byPath[path]} />
        ))}
      </div>
      <OutputPalette snippetId={props.id} />
    </div>
  );
}

interface SnippetOwnProps {
  id: SnippetId;
}

interface SnippetProps {
  id: SnippetId;
  snippetText: SnippetText;
}

export default connect(
  (state: State, ownProps: SnippetOwnProps): SnippetProps => {
    return {
      id: ownProps.id,
      snippetText: getSnippetText(state.undoable.present, ownProps.id)
    };
  }
)(Snippet);
