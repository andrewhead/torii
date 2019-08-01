import { AnyAction } from "redux";
import { LineId, LineVersionId } from "../lines/types";

export const CREATE_STEP = "CREATE_STEP";
export const ADD_LINE_TO_STEP = "ADD_LINE_TO_STEP";
export const PATCH_LINE = "PATCH_LINE";

export interface Step {
  linesAdded: LineVersionId[];
  linesRemoved: LineVersionId[];
}

export type StepId = string;

export type AllSteps = StepId[];
export interface StepsById {
  [stepId: string]: Step;
}
export interface Steps {
  byId: StepsById;
  allSteps: AllSteps;
}

export interface CreateStepAction {
  type: typeof CREATE_STEP;
  id: string;
  index: number;
}

export interface AddLineToStepAction {
  type: typeof ADD_LINE_TO_STEP;
  lineVersionId: LineVersionId;
  stepId: StepId;
}

export interface PatchLineAction {
  type: typeof PATCH_LINE;
  lineId: LineId;
  stepId: StepId;
}

export type StepActionTypes = CreateStepAction | AddLineToStepAction | PatchLineAction;

export function isStepAction(action: AnyAction): action is StepActionTypes {
  return (action as StepActionTypes).type !== undefined;
}