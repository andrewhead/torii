import { CommandId, ContentType, State } from "santoku-store";

/**
 * Assumes there is an output in state with this ID.
 */
export function getOutput(state: State, commandId: CommandId, cellIndex: number) {
  for (let pastCellIndex = cellIndex - 1; pastCellIndex >= 0; pastCellIndex--) {
    const cellId = state.undoable.present.cells.all[pastCellIndex];
    const cell = state.undoable.present.cells.byId[cellId];
    if (cell.type === ContentType.SNIPPET) {
      if (state.outputs.byId[cell.contentId] !== undefined) {
        return state.outputs.byId[cell.contentId][commandId];
      }
    }
  }
}
