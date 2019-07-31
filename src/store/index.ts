import { combineReducers, createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { linesReducer } from './lines/reducers';

export const rootReducer = combineReducers({
    lines: linesReducer
})

export const store = createStore(rootReducer, devToolsEnhancer({}))

export type SantokuState = ReturnType<typeof rootReducer>