import * as React from "react";
import { connect } from "react-redux";
import { CellId, State } from "santoku-store";
import Cell from "./Cell";

export function Santoku(props: SantokuProps) {
  return (
    <div className="Santoku">
      {props.cellIds.map((id, index) => {
        return <Cell id={id} index={index} key={id} />;
      })}
    </div>
  );
}

interface SantokuProps {
  cellIds: CellId[];
}

export default connect((state: State) => {
  return { cellIds: state.undoable.present.cells.all };
})(Santoku);
