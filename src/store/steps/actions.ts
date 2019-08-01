import uuidv4 from "uuid/v4";
import { LineVersionId } from "../lines/types";
import {
  AddLineToStepAction,
  ADD_LINE_TO_STEP,
  CreateStepAction,
  CREATE_STEP,
  StepId
} from "./types";

export function createStep(index: number): CreateStepAction {
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
): AddLineToStepAction {
  return {
    lineVersionId,
    stepId,
    type: ADD_LINE_TO_STEP
  };
}
