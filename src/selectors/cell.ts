import { CellId, State } from "torii-store";

/**
 * Assumes cell with ID is in the state.
 */
export function getCell(state: State, id: CellId) {
  return state.undoable.present.cells.byId[id];
}

export function isSelected(state: State, id: CellId) {
  return state.undoable.present.selectedCell === id;
}
