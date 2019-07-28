export const UPDATE_TEXT = 'SET_TEXT'
export const UPDATE_INDEX = 'UPDATE_INDEX'

export interface Line {
  path: string
  index: number
  version: number
  text: string
}

interface UpdateTextAction {
  type: typeof UPDATE_TEXT
  text: string
}

interface UpdateIndexAction {
  type: typeof UPDATE_INDEX
  index: number
}

export type LineActionTypes = UpdateTextAction | UpdateIndexAction