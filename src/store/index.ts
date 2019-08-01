import { combineReducers, createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { undoableLinesReducer, undoableLineVersionsReducer } from './lines/reducers';
import { AllLines, AllLineVersions, LinesById, LineVersionsById } from './lines/types';
import { undoableStepsReducer } from './steps/reducers';
import { AllSteps, StepsById } from './steps/types';

export const rootReducer = combineReducers({
  lineVersions: undoableLineVersionsReducer,  
  lines: undoableLinesReducer,
  steps: undoableStepsReducer
})

export const store = createStore(rootReducer, devToolsEnhancer({}))

export type UndoableState = ReturnType<typeof rootReducer>

export interface PresentState {
  lineVersions: {
    allLineVersions: AllLineVersions,
    byId: LineVersionsById
  },
  lines: {
    allLines: AllLines,
    byId: LinesById
  },
  steps: {
    allSteps: AllSteps,
    byId: StepsById
  }
}

export function toPresentState(state: UndoableState) {
  return {
    lineVersions: {
      allLineVersions: state.lineVersions.allLineVersions.present,
      byId: state.lineVersions.byId.present
    },
    lines: {
      allLines: state.lines.allLines.present,
      byId: state.lines.byId.present
    },
    steps: {
      allSteps: state.steps.allSteps.present,
      byId: state.steps.byId.present
    }
  }
}