import { styled } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import * as React from "react";
import { connect } from "react-redux";
import { actions, Cell as CellState, CellId, ContentType } from "santoku-store";
import OutputPalette from "./OutputPalette";

export function CellActionPalette(props: CellActionPaletteProps) {
  return (
    <div className={`cell-action-palette ${props.className !== undefined && props.className}`}>
      {props.cell.type === ContentType.SNIPPET && (
        <OutputPalette cellIndex={props.cellIndex} snippetId={props.cell.contentId} />
      )}
      <Button
        className="action-button"
        onClick={() => props.deleteCell(props.cellId, props.cell.type, props.cell.contentId)}
      >
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
  zIndex: theme.zIndex.tooltip,
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
  cell: CellState;
  cellIndex: number;
  className?: string;
}

interface PaletteActions {
  deleteCell: typeof actions.cells.deleteCell;
}

const actionCreators = {
  deleteCell: actions.cells.deleteCell
};

export default connect(
  undefined,
  actionCreators
)(StyledCellActionPalette);
