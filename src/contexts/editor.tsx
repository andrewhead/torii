import React, { ReactNode } from "react";
import { EditorAdapter } from "torii-editor-adapter";

let editorAdapter: EditorAdapter | undefined;

export function setEditorAdapter(adapter: EditorAdapter) {
  editorAdapter = adapter;
}

function getEditorAdapter() {
  return editorAdapter;
}

/**
 * Get a callback for getting the adapter for sending messages to the editor.
 */
export const EditorContext = React.createContext(getEditorAdapter);

export function EditorProvider({ children }: EditorProviderProps) {
  return (
    <EditorContext.Provider value={getEditorAdapter}>
      {children}
    </EditorContext.Provider>
  );
}

interface EditorProviderProps {
  children: ReactNode;
}
