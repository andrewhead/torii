import { State, TextId } from "torii-store";

/**
 * Assumes text with ID is present in state.
 */
export function getValue(state: State, textId: TextId) {
  return state.undoable.present.texts.byId[textId].value;
}
