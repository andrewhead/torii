import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as toriiEditorAdapterClasses from "torii-editor-adapter";
import { EditorProvider, setEditorAdapter } from "./contexts/editor";
import { GetStateContext, getStateFunction, store } from "./contexts/store";
import createTheme from "./contexts/theme";
import Torii from "./widgets/Torii";

declare global {
  interface Window {
    torii: any;
  }
}

const theme = createTheme();

ReactDOM.render(
  <EditorProvider>
    <Provider store={store}>
      <GetStateContext.Provider value={getStateFunction}>
        <DndProvider backend={HTML5Backend}>
          <ThemeProvider theme={theme}>
            <Torii />
          </ThemeProvider>
        </DndProvider>
      </GetStateContext.Provider>
    </Provider>
  </EditorProvider>,
  document.getElementById("root") as HTMLElement
);

/**
 * Assign Torii globals to let IDE extensions take care of setup.
 */
window.torii = {
  ...toriiEditorAdapterClasses,
  setEditorAdapter,
  store
};
