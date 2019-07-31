import { combineReducers } from "redux";
import { LineActionTypes, Lines, LineVersionsById, UpdateTextAction, UPDATE_TEXT } from "./types";

const initialLines: Lines = {
  allLines: [],
  byId: {}
};

export function linesReducer(
  state = initialLines,
  action: LineActionTypes
): Lines {
  switch (action.type) {
    case UPDATE_TEXT:
    default:
      return state;
  }
}

function updateText(state: LineVersionsById, action: UpdateTextAction) {
  const { lineVersionId, text } = action;
  const lineVersion = state[lineVersionId];

  return {
    ...state,
    [lineVersionId]: {
      ...lineVersion,
      text
    }
  };
}

export function lineVersionsByIdReducer(
  state = {},
  action: LineActionTypes
): LineVersionsById {
  switch (action.type) {
    case UPDATE_TEXT:
      return updateText(state, action);
    default:
      return state;
  }
}

export const lineVersionsReducer = combineReducers({
  byId: lineVersionsByIdReducer,
  // allLineVersions: allLineVersionsReducer
});