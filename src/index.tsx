import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as santokuEditorAdapterClasses from "santoku-editor-adapter";
import { store } from "santoku-store";
import "./index.css";
import Santoku from "./Santoku";
import createTheme from "./theme";

declare global {
  interface Window {
    santoku: any;
  }
}

const theme = createTheme();

ReactDOM.render(
  <Provider store={store}>
    {/* <Provider store={store}> */}
    {/* <Provider store={createStoreWithFakeData()}> */}
    {/* Change to createStoreWithFakeData() to code editors in standalone app. */}
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={theme}>
        <Santoku />
      </ThemeProvider>
    </DndProvider>
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
