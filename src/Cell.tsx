import { styled } from "@material-ui/core";
import * as React from "react";
import { useImperativeHandle, useRef } from "react";
import {
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  XYCoord
} from "react-dnd";
import { connect } from "react-redux";
import { actions, Cell as CellState, CellId, ContentType, State } from "santoku-store";
import { DragItemTypes } from "./drag-and-drop";
import Output from "./Output";
import { getCell, isSelected } from "./selectors/cell";
import Snippet from "./Snippet";
import Text from "./Text";

/**
 * A 'cell' containing tutorial content. Can contain text, code, output, etc.
 */
export const DraggableCell = React.forwardRef<HTMLDivElement, DraggableCellProps>(
  (props: DraggableCellProps, ref) => {
    const elementRef = useRef(null);
    props.connectDragSource(elementRef);
    props.connectDropTarget(elementRef);

    useImperativeHandle<{}, CellInstance>(ref, () => ({
      getNode: () => elementRef.current
    }));
    const propsWithoutStyles = { ...props };
    delete propsWithoutStyles.className;
    return (
      <div
        ref={elementRef}
        className={`cell-container
          ${props.selected === true && "selected"}
          ${props.isDragging === true && "drag"}
          ${props.className !== undefined && props.className}`}
        onClick={() => props.selectCell(props.id)}
      >
        <Cell {...propsWithoutStyles} />
      </div>
    );
  }
);

export const StyledDraggableCell = styled(DraggableCell)(({ theme }) => ({
  cursor: "move",
  paddingTop: theme.spaces.cell.paddingTop,
  paddingBottom: theme.spaces.cell.paddingBottom,
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(3),
  paddingLeft: theme.spacing(2),
  borderLeftStyle: "solid",
  borderLeftWidth: theme.spacing(1),
  borderLeftColor: "transparent",
  "&.selected": {
    borderLeftColor: theme.palette.secondaryScale[300]
  },
  "&:hover:not(.selected)": {
    borderLeftColor: theme.palette.secondaryScale[50]
  },
  /*
   * Hack to correct the drag previews. Without this, in VSCode, a drag preview included any
   * selected editor, along with all selected editors below it. For details on why this worked,
   * and whether this bug has been fixed, see:
   * https://github.com/react-dnd/react-dnd/issues/832#issuecomment-442071628
   */
  transform: "translate3d(0, 0, 0)",
  "&.drag": {
    opacity: 0
  }
}));

export function Cell(props: CellProps) {
  return (
    <div className="cell">
      {(() => {
        switch (props.cell.type) {
          case ContentType.SNIPPET:
            return <Snippet id={props.cell.contentId} cellIndex={props.index} />;
          case ContentType.TEXT:
            return <Text id={props.cell.contentId} focused={props.selected} />;
          case ContentType.OUTPUT:
            return <Output id={props.cell.contentId} />;
          default:
            return null;
        }
      })()}
    </div>
  );
}

interface CellDragInfo {
  id: CellId;
  index: number;
  type: string;
}

interface DraggableCellProps extends CellProps {
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  isDragging: boolean;
  className?: string;
}

interface CellProps extends CellActions {
  id: CellId;
  index: number;
  cell: CellState;
  selected: boolean;
  className?: string;
}

interface CellActions {
  move: typeof actions.cells.move;
  selectCell: typeof actions.ui.selectCell;
}

const cellActionCreators = {
  move: actions.cells.move,
  selectCell: actions.ui.selectCell
};

interface CellInitProps {
  id: CellId;
  index: number;
}

interface CellInstance {
  getNode(): HTMLDivElement | null;
}

/*
 * Based on drag-and-drop behavior from React-DnD simple list example. See
 * https://github.com/react-dnd/react-dnd/blob/master/packages/documentation/examples-decorators/src/04-sortable/simple/Card.tsx
 */
export default connect(
  (state: State, ownProps: CellInitProps) => {
    const { id } = ownProps;
    return { ...ownProps, cell: getCell(state, id), selected: isSelected(state, id) };
  },
  cellActionCreators
)(
  DropTarget(
    DragItemTypes.CELL,
    {
      hover: (draggedCell: CellDragInfo, monitor: DropTargetMonitor, component: CellInstance) => {
        if (component === null) {
          return;
        }

        const node = component.getNode();
        if (node === null) {
          return;
        }

        const dropProps = monitor.getItem() as CellProps;
        const dragIndex = monitor.getItem().index;
        const hoverIndex = draggedCell.index;
        if (dragIndex === hoverIndex) {
          return;
        }

        const hoverBoundingRect = node.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

        /*
         * Note from the React-DnD example:
         * Only perform the move when the mouse has crossed half of the items height
         * When dragging downwards, only move when the cursor is below 50%
         * When dragging upwards, only move when the cursor is above 50%
         */
        if (hoverIndex > dragIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (hoverIndex < dragIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        dropProps.move(monitor.getItem().id, hoverIndex);
        monitor.getItem().index = hoverIndex;
        draggedCell.index = hoverIndex;
      }
    },
    (connector: DropTargetConnector) => ({
      connectDropTarget: connector.dropTarget()
    })
  )(
    DragSource(
      DragItemTypes.CELL,
      {
        beginDrag: (props: CellProps): CellDragInfo => {
          props.selectCell(props.id);
          return { id: props.id, index: props.index, type: DragItemTypes.CELL };
        }
      },
      (connector: DragSourceConnector, monitor: DragSourceMonitor) => ({
        connectDragSource: connector.dragSource(),
        isDragging: monitor.isDragging()
      })
    )(StyledDraggableCell)
  )
);
