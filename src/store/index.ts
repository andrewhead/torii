import { combineReducers } from 'redux'
import { lineReducer } from './line/reducers'

const rootReducer = combineReducers({
    line: lineReducer
})

export type SantokuState = ReturnType<typeof rootReducer>