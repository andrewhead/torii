import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import styled from "@material-ui/core/styles/styled";
import withTheme from "@material-ui/core/styles/withTheme";
import Switch from "@material-ui/core/Switch";
import * as React from "react";
import { useContext, useState } from "react";
import { connect } from "react-redux";
import { actions, ChunkId, ChunkVersionId, MergeStrategy, SnippetId, State } from "santoku-store";
import { GetStateContext } from "../contexts/store";
import { canInstantMerge, isLinked } from "../selectors/link";

export function LinkSwitch(props: LinkSwitchProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const getState = useContext(GetStateContext);

  function instantMerge() {
    props.merge(getState(), props.snippetId, props.chunkVersionId, MergeStrategy.REVERT_CHANGES);
  }

  function closeMergeDialog(strategy?: MergeStrategy) {
    if (strategy !== undefined) {
      props.merge(getState(), props.snippetId, props.chunkVersionId, strategy);
    }
    setDialogOpen(false);
  }

  function mergeDialog() {
    setDialogOpen(true);
  }

  function fork() {
    const forkAction = props.fork(props.chunkVersionId);
    props.pickChunkVersion(props.snippetId, props.chunkId, forkAction.forkId);
  }

  return (
    <div className={`${props.className !== undefined && props.className}`}>
      <FormControlLabel
        control={
          <Switch
            checked={props.linked}
            onChange={event =>
              event.target.checked ? (props.instantMerge ? instantMerge() : mergeDialog()) : fork()
            }
            color="secondary"
            size="small"
            value="link"
          />
        }
        label="Sync edits"
      />
      <Dialog
        open={dialogOpen}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">{"Merge your changes?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            To sync this snippet, you must merge your changes into the code before it, or discard
            your changes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeMergeDialog()}>Cancel</Button>
          <Button onClick={() => closeMergeDialog(MergeStrategy.REVERT_CHANGES)} autoFocus={true}>
            Discard
          </Button>
          <Button onClick={() => closeMergeDialog(MergeStrategy.SAVE_CHANGES)}>Merge</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const StyledLinkSwitch = styled(withTheme(LinkSwitch))(({ theme }) => ({
  marginTop: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  "& label": {
    marginRight: theme.spacing(1)
  },
  "& .MuiFormControlLabel-label": {
    fontSize: theme.typography.caption.fontSize,
    backgroundColor: theme.palette.secondaryScale[50]
  }
}));

interface LinkSwitchOwnProps {
  snippetId: SnippetId;
  chunkVersionId: ChunkVersionId;
}

interface LinkSwitchProps extends LinkSwitchActions {
  linked: boolean;
  instantMerge: boolean;
  snippetId: SnippetId;
  chunkId: ChunkId;
  chunkVersionId: ChunkVersionId;
  className?: string;
}

interface LinkSwitchActions {
  fork: typeof actions.code.fork;
  pickChunkVersion: typeof actions.code.pickChunkVersion;
  merge: typeof actions.code.merge;
}

const linkSwitchActionCreators = {
  fork: actions.code.fork,
  pickChunkVersion: actions.code.pickChunkVersion,
  merge: actions.code.merge
};

export default connect(
  (state: State, ownProps: LinkSwitchOwnProps) => {
    return {
      ...ownProps,
      linked: isLinked(state, ownProps.chunkVersionId, ownProps.snippetId),
      instantMerge: canInstantMerge(state, ownProps.chunkVersionId, ownProps.snippetId),
      chunkId: state.undoable.present.chunkVersions.byId[ownProps.chunkVersionId].chunk
    };
  },
  linkSwitchActionCreators
)(StyledLinkSwitch);
