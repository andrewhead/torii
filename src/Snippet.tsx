import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { styled } from "@material-ui/core/styles";
import * as React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Path, SnippetId, State } from "santoku-store";
import OutputPalette from "./OutputPalette";
import { getSnippetPaths } from "./selectors/snippet";
import SnapshotEditor from "./SnapshotEditor";
import SnippetEditor from "./SnippetEditor";

/**
 * Will contain multiple editors, if snippet contains code for multiple paths.
 */
export function SnippetContainer(props: SnippetProps) {
  const [tab, setTab] = useState<"snippet" | "snapshot">("snippet");

  useEffect(() => {
    if (props.focused === false) {
      setTab("snippet");
    }
  }, [props.focused]);

  return (
    <div
      className={`snippet ${props.focused !== false && "focused"}
        ${props.className !== undefined && props.className}`}
    >
      <div className="code-editors">
        {props.paths.map((path: Path) => (
          <div key="path">
            {/*
             * Buttons are used here for tab behavior instead of Material UI tabs, as tabs were
             * taking up too much time to re-render, for a reason I couldn't determine.
             */}
            {/*
             * In the future, may want to use icons on the buttons. If so, two options are Cropy75
             * for snippet (wide rectangle) and CropyPortrait(tall rectangle).
             */}
            <ButtonGroup color="secondary" className="tabs">
              <Button
                variant={tab === "snippet" ? "contained" : "outlined"}
                onClick={() => {
                  setTab("snippet");
                }}
              >
                Edit Snippet
              </Button>
              <Button
                variant={tab === "snapshot" ? "contained" : "outlined"}
                onClick={() => {
                  setTab("snapshot");
                }}
              >
                Edit Program Snapshot
              </Button>
            </ButtonGroup>
            <SnippetEditor
              hidden={tab !== "snippet"}
              key={`${path}-snippet`}
              path={path}
              snippetId={props.id}
            />
            <SnapshotEditor
              hidden={tab !== "snapshot"}
              key={`${path}-snapshot`}
              path={path}
              snippetId={props.id}
            />
          </div>
        ))}
      </div>
      <OutputPalette snippetId={props.id} cellIndex={props.cellIndex} />
    </div>
  );
}

const StyledSnippet = styled(SnippetContainer)(({ theme }) => ({
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
  "&:not(.focused)": {
    "& .tabs": {
      display: "none"
    }
  },
  "& .tabs": {
    position: "absolute",
    zIndex: theme.zIndex.tooltip,
    backgroundColor: theme.palette.background.paper,
    // bottom: "calc(100% - " + theme.spaces.cell.paddingTop + "px)",
    bottom: "100%",
    right: 0
  }
}));

interface SnippetOwnProps {
  id: SnippetId;
  cellIndex: number;
  focused: boolean;
}

interface SnippetProps {
  id: SnippetId;
  paths: Path[];
  cellIndex: number;
  focused: boolean;
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
