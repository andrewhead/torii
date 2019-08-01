import uuidv4 from "uuid/v4";
import { LineVersionId } from "../lines/types";
import { ADD_LINE, CREATE_STEP, StepActionTypes, StepId } from "./types";

export function createStep(index: number): StepActionTypes {
  const id = uuidv4();
  return {
    id,
    index,
    type: CREATE_STEP
  };
}

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
