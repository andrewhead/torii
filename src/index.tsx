import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as santokuEditorAdapterClasses from "santoku-editor-adapter";
import { store } from "santoku-store";
import "./index.css";
import Santoku from "./Santoku";

declare global {
  interface Window {
    santoku: any;
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Santoku />
  </Provider>,
  document.getElementById("root") as HTMLElement
);

/**
 * Assign Santoku globals to let IDE extensions take care of setup.
 */
window.santoku = {
  ...santokuEditorAdapterClasses,
  store
};
