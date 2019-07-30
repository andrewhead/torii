import {
    Line,
    LineActionTypes,
    UPDATE_INDEX,
    UPDATE_TEXT
} from './types'

const initialState: Line = {
    index: -1,
    path: "",
    text: "",
    version: -1
}

export function lineReducer(
    state = initialState,
    action: LineActionTypes
): Line {
    switch (action.type) {
        case UPDATE_INDEX:
            return { ...state, index: action.index }
        case UPDATE_TEXT:
            return { ...state, text: action.text }
        default:
            return state
    }
}

export default lineReducer