import AppBar from "@material-ui/core/AppBar";
import { styled } from "@material-ui/core/styles";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import * as React from "react";
import { connect } from "react-redux";
import { CellId, State } from "santoku-store";
import Cell from "./Cell";
import Toolbar from "./Toolbar";

export function Santoku(props: SantokuProps) {
  return (
    <div className={`Santoku ${props.className !== undefined && props.className}`}>
      <ElevationScroll>
        <AppBar position="fixed">
          <Toolbar />
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <div className="cells">
        {props.cellIds.map((id, index) => {
          return <Cell id={id} index={index} key={id} />;
        })}
      </div>
    </div>
  );
}

function ElevationScroll(props: ElevationScrollProps) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });

  return React.cloneElement(props.children, {
    elevation: trigger ? 4 : 0
  });
}

interface ElevationScrollProps {
  children: React.ReactElement;
}

interface SantokuProps {
  cellIds: CellId[];
  className?: string;
}

const StyledSantoku = styled(Santoku)(({ theme }) => ({
  "& .cells": {
    marginTop: theme.spacing(3),
    marginBottom: "50%"
  }
}));

export default connect((state: State) => {
  return { cellIds: state.undoable.present.cells.all };
})(StyledSantoku);
