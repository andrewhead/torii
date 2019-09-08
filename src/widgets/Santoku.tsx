import AppBar from "@material-ui/core/AppBar";
import { styled } from "@material-ui/core/styles";
import MaterialUiToolbar from "@material-ui/core/Toolbar";
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
        <AppBar className="app-bar" position="fixed">
          <Toolbar />
        </AppBar>
      </ElevationScroll>
      {/*
       * Include and empty toolbar to hold the place of the toolbar at the top of the page,
       * so no cells appear beneath the elevated toolbar when scrolled to the top.
       */}
      <MaterialUiToolbar variant="dense" />
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
    elevation: trigger ? 2 : 0
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
  backgroundColor: theme.palette.background.paper,
  "& .cells": {
    marginTop: theme.spacing(4),
    /*
     * Add enough margin to the bottom of the document so that the user can scroll until the
     * very last cells are at the top of the window.
     */
    marginBottom: "80%"
  }
}));

export default connect((state: State) => {
  return { cellIds: state.undoable.present.cells.all };
})(StyledSantoku);
