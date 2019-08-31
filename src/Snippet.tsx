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
  },
  /*
   * Give code cell a light left border so that it's obvious that this cell aligns with other cell
   * contents, despite the line gutter on the code editor.
   */
  borderLeftStyle: "solid",
  borderLeftWidth: theme.spacing(1),
  borderLeftColor: theme.palette.primary.main,
  /*
   * Make the border span the entire height of the cell.
   */
  paddingTop: theme.spaces.cell.paddingTop,
  paddingBottom: theme.spaces.cell.paddingBottom,
  marginTop: -theme.spaces.cell.paddingTop,
  marginBottom: -theme.spaces.cell.paddingBottom
}));

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
