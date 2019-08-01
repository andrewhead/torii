import { combineReducers, createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { undoableLinesReducer, undoableLineVersionsReducer } from './lines/reducers';
import { undoableStepsReducer } from './steps/reducers';

export const rootReducer = combineReducers({
  lineVersions: undoableLineVersionsReducer,  
  lines: undoableLinesReducer,
  steps: undoableStepsReducer
})

export const store = createStore(rootReducer, devToolsEnhancer({}))

export type SantokuState = ReturnType<typeof rootReducer>