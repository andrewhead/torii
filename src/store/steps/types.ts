import { LineId, LineVersionId } from '../lines/types'

export const ADD_LINE = 'SET_TEXT'

export const PATCH_LINE = "PATCH_LINE";

export type StepId = string;

export type Step = {
    linesAdded: LineVersionId[]
    linesRemoved: LineVersionId[]
}

interface PatchLineAction {
    type: typeof PATCH_LINE;
    lineId: LineId;
    stepId: StepId;
}

export type StepActionTypes = PatchLineAction;