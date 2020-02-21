import { styled } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { actions, CellId, ContentType } from "torii-store";
import OutputPalette from "./OutputPalette";

export function CellActionPalette(props: CellActionPaletteProps) {
  function deleteCell(event: React.MouseEvent) {
    /*
     * Prevent event from bubbling up to the parent and making it get selected.
     */
    event.stopPropagation();
    props.deleteCell(props.cellId, props.contentType, props.contentId);
  }

  function hide(event: React.MouseEvent) {
    /*
     * Prevent event from bubbling up to the parent and making it get selected.
     */
    event.stopPropagation();
    props.hide(props.cellId);
  }

  return (
    <div
      className={`cell-action-palette ${props.className !== undefined &&
        props.className}`}
    >
      {props.contentType === ContentType.SNIPPET && (
        <OutputPalette
          cellIndex={props.cellIndex}
          snippetId={props.contentId}
        />
      )}
      <Button className="action-button" onClick={hide}>
        <VisibilityOffIcon />
      </Button>
      <Button className="action-button" onClick={deleteCell}>
        <DeleteIcon />
      </Button>
    </div>
  );
}

const StyledCellActionPalette = styled(CellActionPalette)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderColor: theme.palette.primary.main,
  borderStyle: "solid",
  borderWidth: 1,
  borderRadius: theme.shape.borderRadius,
  zIndex: theme.zIndex.mobileStepper,
  display: "inline-flex",
  position: "absolute",
  bottom: 0,
  right: 0,
  "& .action-button": {
    minWidth: 0
  }
}));

interface CellActionPaletteProps extends PaletteActions {
  cellId: CellId;
  contentType: ContentType;
  contentId: any;
  cellIndex: number;
  className?: string;
}

interface PaletteActions {
  deleteCell: typeof actions.cells.deleteCell;
  hide: typeof actions.cells.hide;
}

const actionCreators = {
  deleteCell: actions.cells.deleteCell,
  hide: actions.cells.hide
};

export default connect(undefined, actionCreators, undefined, {
  pure: true,
  areStatePropsEqual: _.isEqual
})(StyledCellActionPalette);
