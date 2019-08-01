import { AnyAction } from "redux";
import { LineId, LineVersionId } from "../lines/types";

export const ADD_LINE = "ADD_LINE";
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

export interface AddLineAction extends AnyAction {
  type: typeof ADD_LINE;
  lineVersionId: LineVersionId;
  stepId: StepId;
}

export interface PatchLineAction extends AnyAction {
  type: typeof PATCH_LINE;
  lineId: LineId;
  stepId: StepId;
}

export type StepActionTypes = AddLineAction | PatchLineAction;

export function isStepActionType(action: AnyAction): action is StepActionTypes {
  return (action as StepActionTypes).type !== undefined;
}