import { styled } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
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
            <Tabs className="tabs" value={tab} onChange={(_, newTab) => setTab(newTab)}>
              {/*
               * In the future, may want to use icons to convey snippets and snapshots.
               * If so, two options are Cropy75 for snippet (wide rectangle) and CropyPortrait
               * (tall rectangle).
               */}
              <Tab key="snippet" value="snippet" label="Edit Snippet" />
              <Tab key="snapshot" value="snapshot" label="Edit Program Snapshot" />
            </Tabs>
            <div hidden={tab !== "snippet"}>
              <SnippetEditor key={path} path={path} snippetId={props.id} />
            </div>
            <div hidden={tab !== "snapshot"}>
              <SnapshotEditor key={path} path={path} snippetId={props.id} />
            </div>
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
    backgroundColor: theme.palette.background.paper,
    bottom: "calc(100% - " + theme.spaces.cell.paddingTop + "px)",
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
