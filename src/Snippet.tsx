import { styled } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import { Path, SnippetId, State } from "santoku-store";
import CodePreview from "./CodePreview";
import OutputPalette from "./OutputPalette";
import { getSnippetText } from "./selectors/snippet";
import { SnippetText } from "./selectors/types";

/**
 * Will contain multiple editors, if snippet contains code for multiple paths.
 */
export function Snippet(props: SnippetProps) {
  return (
    <div className={`snippet ${props.className !== undefined && props.className}`}>
      <div className="code-previews">
        {props.snippetText.paths.map((path: Path) => (
          <CodePreview key={path} path={path} {...props.snippetText.byPath[path]} />
        ))}
      </div>
      <OutputPalette snippetId={props.id} cellIndex={props.cellIndex} />
    </div>
  );
}

const StyledSnippet = styled(Snippet)({
  /*
   * Allows absolute positioning of the output palette.
   */
  position: "relative",
  "& .output-palette": {
    visibility: "hidden"
  },
  "&:hover": {
    "& .output-palette": {
      visibility: "visible"
    }
  }
});

interface SnippetOwnProps {
  id: SnippetId;
  cellIndex: number;
}

interface SnippetProps {
  id: SnippetId;
  snippetText: SnippetText;
  cellIndex: number;
  className?: string;
}

export default connect(
  (state: State, ownProps: SnippetOwnProps): SnippetProps => {
    return {
      id: ownProps.id,
      cellIndex: ownProps.cellIndex,
      snippetText: getSnippetText(state.undoable.present, ownProps.id)
    };
  }
)(StyledSnippet);
