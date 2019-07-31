import { combineReducers } from "redux";
import { AddLineAction, ADD_LINE, StepActionTypes, Steps, StepsById } from "./types";

const initialSteps: Steps = {
  allSteps: [],
  byId: {}
};

export function stepsByIdReducer(
  state = {},
  action: StepActionTypes
): StepsById {
  switch(action.type) {
    case ADD_LINE:
      return addLine(state, action);
    default:
      return state;
  }
}

function addLine(state: StepsById, action: AddLineAction) {
  const { stepId, lineVersionId } = action;
  const step = state[stepId];
  const linesAdded = step.linesAdded;

  return {
    ...state,
    [stepId]: {
      ...step,
      linesAdded: linesAdded.indexOf(lineVersionId) === -1 ? linesAdded.concat(lineVersionId) : linesAdded
    }
  };
}

export const stepsReducer = combineReducers({
  byId: stepsByIdReducer,
  // allLineVersions: allLineVersionsReducer
});