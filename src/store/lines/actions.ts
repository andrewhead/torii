import { LineActionTypes, LineVersionId, UPDATE_TEXT } from './types';

export function updateText(lineVersionId: LineVersionId, text: string): LineActionTypes {
    return {
        lineVersionId,
        text,
        type: UPDATE_TEXT
    }
}

/*
export function updatePath(path: string, newPath: string): LineActionTypes {
    return {
        newPath,
        path,
        type: UPDATE_PATH
    }
}

export function removeLine(id: LineId): LineActionTypes {
    return {
        id,
        type: REMOVE_LINE
    }
}
*/