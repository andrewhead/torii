import { styled } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import { Path, SnippetId, State } from "santoku-store";
import OutputPalette from "./OutputPalette";
import { getSnippetPaths } from "./selectors/snippet";
import SnippetEditor from "./SnippetEditor";

/**
 * Will contain multiple editors, if snippet contains code for multiple paths.
 */
export function Snippet(props: SnippetProps) {
  return (
    <div className={`snippet ${props.className !== undefined && props.className}`}>
      <div className="code-previews">
        {props.paths.map((path: Path) => (
          <SnippetEditor key={path} path={path} snippetId={props.id} />
        ))}
      </div>
      <OutputPalette snippetId={props.id} cellIndex={props.cellIndex} />
    </div>
  );
}

const StyledSnippet = styled(Snippet)(({ theme }) => ({
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
}));

interface SnippetOwnProps {
  id: SnippetId;
  cellIndex: number;
}

interface SnippetProps {
  id: SnippetId;
  paths: Path[];
  cellIndex: number;
  className?: string;
}

export default connect(
  (state: State, ownProps: SnippetOwnProps): SnippetProps => {
    return {
      ...ownProps,
      paths: getSnippetPaths(state, ownProps.id)
    };
  }
)(StyledSnippet);
