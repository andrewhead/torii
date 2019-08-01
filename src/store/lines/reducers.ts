import { AnyAction, combineReducers } from "redux";
import undoable from "redux-undo";
import { AllLines, AllLineVersion as AllLineVersions, isLineActionType, LinesById, LineVersionsById, UpdateTextAction, UPDATE_TEXT } from "./types";

export function allLinesReducer(
  state: AllLines = [],
  action: AnyAction
): AllLines {
  return state;
}

export function linesByIdReducer(
  state = {},
  action: AnyAction
): LinesById {
  return state;
}

export const undoableLinesReducer = combineReducers({
  allLines: undoable<AllLines>(allLinesReducer),
  byId: undoable<LinesById>(linesByIdReducer)
});

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

export function allLineVersionsReducer(
  state: AllLineVersions = [],
  action: AnyAction
): AllLineVersions {
  return state;
}

export function lineVersionsByIdReducer(
  state = {},
  action: AnyAction
): LineVersionsById {
  if (isLineActionType(action)) {
    switch (action.type) {
      case UPDATE_TEXT:
        return updateText(state, action);
      default:
        return state;
    }
  }
  return state;
}

export const undoableLineVersionsReducer = combineReducers({
  allLineVersions: undoable<AllLineVersions>(allLineVersionsReducer),
  byId: undoable<LineVersionsById>(lineVersionsByIdReducer)
});
