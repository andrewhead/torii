import { AnyAction, combineReducers } from "redux";
import undoable from "redux-undo";
import {
  AddLineToStepAction,
  ADD_LINE_TO_STEP,
  AllSteps,
  CreateStepAction,
  CREATE_STEP,
  isStepAction,
  StepsById
} from "./types";

/**
 * TODO(andrewhead): This and other reducer functions takes AnyAction as the second argument and
 * checks its type to make sure it is a step action. This is because of a limitation of the
 * undoable library where currently, the type of action is constrained to be "AnyAction". When that
 * bug gets fixed, all of these reducers should be refactored to take a more precise type as the
 * second argument. Follow the issue here: https://github.com/omnidan/redux-undo/issues/229
 */
export function allStepsReducer(
  state: AllSteps = [],
  action: AnyAction
): AllSteps {
  if (isStepAction(action)) {
    switch (action.type) {
      case CREATE_STEP:
        return insertStepInAllLines(state, action);
      default:
        return state;
    }
  }
  return state;
}

function insertStepInAllLines(state: AllSteps, action: CreateStepAction) {
  const { id, index } = action;
  return state
    .slice(0, index)
    .concat(id)
    .concat(state.slice(index, state.length));
}

export function stepsByIdReducer(state = {}, action: AnyAction): StepsById {
  if (isStepAction(action)) {
    switch (action.type) {
      case ADD_LINE_TO_STEP:
        return addLine(state, action);
      case CREATE_STEP:
        return insertStepInById(state, action);
      default:
        return state;
    }
  }
  return state;
}

function insertStepInById(state: StepsById, action: CreateStepAction) {
  return {
    ...state,
    [action.id]: {
      linesAdded: [],
      linesRemoved: []
    }
  };
}

function addLine(state: StepsById, action: AddLineToStepAction) {
  const { stepId, lineVersionId } = action;
  const step = state[stepId];
  const linesAdded = step.linesAdded;

  return {
    ...state,
    [stepId]: {
      ...step,
      linesAdded:
        linesAdded.indexOf(lineVersionId) === -1
          ? linesAdded.concat(lineVersionId)
          : linesAdded
    }
  };
}

export const undoableStepsReducer = combineReducers({
  allSteps: undoable<AllSteps>(allStepsReducer),
  byId: undoable<StepsById>(stepsByIdReducer)
});
