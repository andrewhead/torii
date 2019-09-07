import React from "react";
import { store } from "santoku-store";

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
