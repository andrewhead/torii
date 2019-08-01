import { AnyAction, combineReducers } from "redux";
import undoable from "redux-undo";
import { AllLines, AllLineVersions, CreateLineAction, CREATE_LINE, isLineAction, LinesById, LineVersionsById, UpdateTextAction, UPDATE_TEXT } from "./types";

function addLineToAllLines(state: AllLines, action: CreateLineAction) {
  return state.concat(action.id);
}

export function allLinesReducer(
  state: AllLines = [],
  action: AnyAction
): AllLines {
  if (isLineAction(action)) {
    switch (action.type) {
      case CREATE_LINE:
        return addLineToAllLines(state, action);
      default:
        return state;
    }
  }
  return state;
}

function addLineToLinesById(state: LinesById, action: CreateLineAction) {
  const updatedState = { ...state };
  if (action.insert) {
    for (const otherLineId in updatedState) {
      if (updatedState.hasOwnProperty(otherLineId)) {
        const otherLine = updatedState[otherLineId];
        const otherLineLocation = otherLine.location;
        if (otherLineLocation.path === action.location.path && otherLineLocation.index >= action.location.index) {
          updatedState[otherLineId] = {
            ...otherLine,
            location: { ...otherLineLocation, index: otherLineLocation.index + 1 }
          };
        }
      }
    }
  }
  updatedState[action.id] = {
      location: action.location,
      versions: []
  };
  if (action.initialVersionId !== undefined && action.initialVersionText !== undefined) {
    updatedState[action.id].versions = [action.initialVersionId];
  }
  return updatedState;
}

export function linesByIdReducer(state = {}, action: AnyAction): LinesById {
  if (isLineAction(action)) {
    switch (action.type) {
      case CREATE_LINE:
        return addLineToLinesById(state, action);
      default:
        return state;
    }
  }
  return state;
}

export const undoableLinesReducer = combineReducers({
  allLines: undoable<AllLines>(allLinesReducer),
  byId: undoable<LinesById>(linesByIdReducer)
});

function addLineVersionToAllLineVersions(
  state: AllLineVersions,
  action: CreateLineAction
) {
  if (action.initialVersionId !== undefined && action.initialVersionText !== undefined) {
    return state.concat(action.initialVersionId);
  }
  return state;
}

export function allLineVersionsReducer(
  state: AllLineVersions = [],
  action: AnyAction
): AllLineVersions {
  if (isLineAction(action)) {
    switch (action.type) {
      case CREATE_LINE:
        return addLineVersionToAllLineVersions(state, action);
      default:
        return state;
    }
  }
  return state;
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

function addLineVersionToLineVersionsById(
  state: LineVersionsById,
  action: CreateLineAction
) {
  if (
    action.initialVersionId !== undefined &&
    action.initialVersionText !== undefined
  ) {
    return {
      ...state,
      [action.initialVersionId]: {
        line: action.id,
        text: action.initialVersionText
      }
    };
  }
  return state;
}

export function lineVersionsByIdReducer(
  state = {},
  action: AnyAction
): LineVersionsById {
  if (isLineAction(action)) {
    switch (action.type) {
      case CREATE_LINE:
        return addLineVersionToLineVersionsById(state, action);
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
