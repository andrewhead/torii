import * as React from "react";
import { connect } from "react-redux";
import { Cells, State } from "santoku-store";
import Cell from "./Cell";

export function Santoku(props: SantokuProps) {
  return (
    <div className="Santoku">
      {props.cells.all.map((id, index) => {
        const cell = props.cells.byId[id];
        return <Cell id={id} cell={cell} index={index} key={id} />;
      })}
    </div>
  );
}

interface SantokuProps {
  cells: Cells;
}

export default connect((state: State) => {
  return { cells: state.undoable.present.cells };
})(Santoku);
