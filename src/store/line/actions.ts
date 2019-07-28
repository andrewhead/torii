import { Line, LineActionTypes, UPDATE_INDEX, UPDATE_TEXT } from './types'

export function updateText(text: string): LineActionTypes {
    return {
        text,
        type: UPDATE_TEXT
    }
}

export function updateIndex(index: number): LineActionTypes {
    return {
        index,
        type: UPDATE_INDEX
    }
}