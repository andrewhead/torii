import React from "react";
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { createStore } from "torii-store";

export const actionLog: AnyAction[] = [];

const logger: Middleware = (api: MiddlewareAPI) => (next: Dispatch) => (
  action: AnyAction
) => {
  actionLog.push(action);
  return next(action);
};

const store = createStore(undefined, logger);

/*
 * To test this application standalone with pre-loaded data:
 * import { createStoreWithFakeData } from "./test/util";
 * const store = createStoreWithFakeData();
 */

/**
 * Default function for getting state from the data store. Should only be accessed through
 * the GetStateContext.
 */
export const getStateFunction = () => store.getState();

/**
 * Sometimes a component will want to access state without needing to render based on changes
 * to the state. In that case, they can consume the 'GetStateContext'
 */
export const GetStateContext = React.createContext(() => {
  return store.getState();
});

export { store };
export default store;
