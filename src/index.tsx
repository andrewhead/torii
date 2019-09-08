import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as santokuEditorAdapterClasses from "santoku-editor-adapter";
import { EditorProvider, setEditorAdapter } from "./contexts/editor";
import { GetStateContext, getStateFunction, store } from "./contexts/store";
import createTheme from "./contexts/theme";
import Santoku from "./widgets/Santoku";

declare global {
  interface Window {
    santoku: any;
  }
}

const theme = createTheme();

ReactDOM.render(
  <EditorProvider>
    <Provider store={store}>
      <GetStateContext.Provider value={getStateFunction}>
        <DndProvider backend={HTML5Backend}>
          <ThemeProvider theme={theme}>
            <Santoku />
          </ThemeProvider>
        </DndProvider>
      </GetStateContext.Provider>
    </Provider>
  </EditorProvider>,
  document.getElementById("root") as HTMLElement
);

/**
 * Assign Santoku globals to let IDE extensions take care of setup.
 */
window.santoku = {
  ...santokuEditorAdapterClasses,
  setEditorAdapter,
  store
};
