import { LineVersionId } from "../lines/types";
import { ADD_LINE, StepActionTypes, StepId } from "./types";

export function addLine(
  stepId: StepId,
  lineVersionId: LineVersionId
): StepActionTypes {
  return {
    lineVersionId,
    stepId,
    type: ADD_LINE
  };
}