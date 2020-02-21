import { styled } from "@material-ui/core";
import _ from "lodash";
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
import { actions, CellId, ContentType, State } from "torii-store";
import { DragItemTypes } from "../contexts/drag-and-drop";
import { getCell, isSelected } from "../selectors/cell";
import CellActionPalette from "./CellActionPalette";
import Output from "./Output";
import Snippet from "./Snippet";
import Text from "./Text";

/**
 * A 'cell' containing tutorial content. Can contain text, code, output, etc.
 */
export const DraggableCell = React.forwardRef<
  HTMLDivElement,
  DraggableCellProps
>((props: DraggableCellProps, ref) => {
  const elementRef = useRef<HTMLDivElement>(null);
  props.connectDragSource(elementRef);
  props.connectDropTarget(elementRef);

  function handle() {
    return {
      getNode: () => elementRef.current
    };
  }

  function dragStart() {
    /*
     * To generate a preview with the 'tranform' property, this class must be added before
     * the preview is generated. This is one place where the class can be added early enough.
     */
    if (elementRef !== null && elementRef.current !== null) {
      elementRef.current.classList.add("dragJustTriggered");
    }
  }

  function selectCell() {
    props.selectCell(props.id);
  }

  useImperativeHandle<{}, CellInstance>(ref, handle, [ref]);
  const propsWithoutStyles = { ...props };
  delete propsWithoutStyles.className;
  return (
    <div
      ref={elementRef}
      onDragStart={dragStart}
      className={`cell-container
          ${props.hidden === true && "hidden"}
          ${props.selected === true && "selected"}
          ${props.isDragging === true && "drag"}
          ${props.className !== undefined && props.className}`}
      onClick={selectCell}
    >
      <Cell {...propsWithoutStyles} />
    </div>
  );
});

export const StyledDraggableCell = styled(DraggableCell)(({ theme }) => ({
  cursor: "move",
  paddingTop: theme.spaces.cell.paddingTop,
  paddingBottom: theme.spaces.cell.paddingBottom,
  paddingLeft: theme.spacing(2),
  borderLeftStyle: "solid",
  borderLeftWidth: theme.spacing(1),
  borderLeftColor: "transparent",
  "&.cell-container.selected:not(.hidden)": {
    borderLeftColor: theme.palette.secondaryScale[300]
  },
  "&.cell-container:hover:not(.hidden):not(.selected)": {
    borderLeftColor: theme.palette.secondaryScale[50]
  },
  "& .hidden-marker": {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    height: 1,
    border: 0,
    borderBottomWidth: theme.shape.borderWidth,
    borderBottomColor: theme.palette.primary.main,
    borderBottomStyle: "solid",
    "&:hover": {
      borderBottomWidth: theme.shape.borderWidth * 2,
      borderBottomColor: theme.palette.secondary.main
    }
  },
  /*
   * Allows absolute positioning of the cell action palette.
   */
  position: "relative",
  "& .cell-action-palette": {
    visibility: "hidden"
  },
  "&:hover": {
    "& .cell-action-palette": {
      visibility: "visible"
    }
  },
  /*
   * Hack to correct the drag previews. Make sure this class is added to cell before a drag
   * preview is generated. Currently, this needs to occur before the react-dnd handlers set
   * in (e.g., right when 'onDragStart' is called).
   *
   * This class must be removed after the drag is complete for overlays to render at the right
   * z-index. Otherwise, this transform sets a new stack context, which means that tooltips may
   * end up getting obscured by other content within a higher stack context.
   *
   * Without this, in VSCode, a drag preview included any selected editor, along with all
   * selected editors below it. For details on why this worked, and whether this bug has
   * been fixed, see:
   * https://github.com/react-dnd/react-dnd/issues/832#issuecomment-442071628
   */
  "&.dragJustTriggered": {
    transform: "translate3d(0, 0, 0)"
  },
  "&.drag": {
    opacity: 0
  }
}));

export function Cell(props: CellProps) {
  function show() {
    props.show(props.id);
  }

  if (props.hidden) {
    return (
      <div className="cell-hidden" onClick={show}>
        <hr className="hidden-marker" />
      </div>
    );
  }

  return (
    <div className="cell">
      {props.type === ContentType.SNIPPET && (
        <Snippet
          id={props.contentId}
          cellIndex={props.index}
          focused={props.selected}
        />
      )}
      {props.type === ContentType.TEXT && (
        <Text id={props.contentId} focused={props.selected} />
      )}
      {props.type === ContentType.OUTPUT && (
        <Output id={props.contentId} cellIndex={props.index} />
      )}
      <CellActionPalette
        cellId={props.id}
        contentType={props.type}
        contentId={props.contentId}
        cellIndex={props.index}
      />
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
  type: ContentType;
  contentId: any;
  hidden: boolean;
  selected: boolean;
  className?: string;
}

interface CellActions {
  move: typeof actions.cells.move;
  selectCell: typeof actions.ui.selectCell;
  show: typeof actions.cells.show;
}

const cellActionCreators = {
  move: actions.cells.move,
  selectCell: actions.ui.selectCell,
  show: actions.cells.show
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
    const cell = getCell(state, id);
    return {
      ...ownProps,
      type: cell.type,
      contentId: cell.contentId,
      hidden: cell.hidden,
      selected: isSelected(state, id)
    };
  },
  cellActionCreators,
  undefined,
  { pure: true, areStatePropsEqual: _.isEqual }
)(
  DropTarget(
    DragItemTypes.CELL,
    {
      hover: (
        draggedCell: CellProps,
        monitor: DropTargetMonitor,
        component: CellInstance
      ) => {
        if (component === null) {
          return;
        }

        const node = component.getNode();
        if (node === null) {
          return;
        }

        const dragIndex = monitor.getItem().index;
        const hoverIndex = draggedCell.index;
        if (dragIndex === hoverIndex) {
          return;
        }

        const hoverBoundingRect = node.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY =
          (clientOffset as XYCoord).y - hoverBoundingRect.top;

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

        draggedCell.move(monitor.getItem().id, hoverIndex);
        monitor.getItem().index = hoverIndex;
        /*
         * TODO(andrewhead): Figure out why taking this out fixed drag-and-drop issue in debug mode.
         */
        // draggedCell.index = hoverIndex;
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
