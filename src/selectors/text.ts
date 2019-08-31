import { State, TextId } from "santoku-store";

/**
 * Assumes text with ID is present in state.
 */
export function getValue(state: State, textId: TextId) {
  return state.undoable.present.texts.byId[textId].value;
}
