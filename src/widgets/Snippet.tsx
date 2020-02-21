import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { styled } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import * as React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Path, selectors, SnippetId, State } from "torii-store";
import SnapshotEditor from "./SnapshotEditor";
import SnippetEditor from "./SnippetEditor";

/**
 * Will contain multiple editors, if snippet contains code for multiple paths.
 */
export function Snippet(props: SnippetProps) {
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
          <div key={path}>
            {/*
             * Buttons are used here for tab behavior instead of Material UI tabs, as tabs were
             * taking up too much time to re-render, for a reason I couldn't determine.
             */}
            {/*
             * In the future, may want to use icons on the buttons. If so, two options are Cropy75
             * for snippet (wide rectangle) and CropyPortrait(tall rectangle).
             */}
            <div className="tabs">
              <Typography variant="button" className="view-label">
                View As
              </Typography>
              <ButtonGroup variant="outlined">
                <Button
                  color={tab === "snippet" ? "secondary" : "inherit"}
                  onClick={() => {
                    setTab("snippet");
                  }}
                >
                  Snippet
                </Button>
                <Button
                  color={tab === "snapshot" ? "secondary" : "inherit"}
                  onClick={() => {
                    setTab("snapshot");
                  }}
                >
                  Program Snapshot
                </Button>
              </ButtonGroup>
            </div>
            <SnippetEditor
              hidden={tab !== "snippet"}
              key={"snippet"}
              path={path}
              snippetId={props.id}
            />
            <SnapshotEditor
              hidden={tab !== "snapshot"}
              key={"snapshot"}
              path={path}
              snippetId={props.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const StyledSnippet = styled(Snippet)(({ theme }) => ({
  "&:not(.focused)": {
    "& .tabs": {
      display: "none"
    }
  },
  "& .tabs": {
    position: "absolute",
    zIndex: theme.zIndex.mobileStepper,
    backgroundColor: theme.palette.background.paper,
    bottom: "calc(100% - " + theme.spaces.cell.paddingTop + "px)",
    right: 0,
    "& .view-label": {
      display: "inline-flex",
      flexDirection: "column",
      justifyContent: "center",
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    }
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

const MemoizedSnippet = React.memo(StyledSnippet, _.isEqual);

export default connect(
  (state: State, ownProps: SnippetOwnProps): SnippetProps => {
    return {
      ...ownProps,
      paths: selectors.code.getSnippetPaths(state, ownProps.id)
    };
  },
  undefined,
  undefined,
  { pure: true, areStatePropsEqual: _.isEqual }
)(MemoizedSnippet);
