import { combineReducers, createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { lineReducer } from './line/reducers';

export const rootReducer = combineReducers({
    line: lineReducer
})

export const store = createStore(rootReducer, devToolsEnhancer({}))

export type SantokuState = ReturnType<typeof rootReducer>