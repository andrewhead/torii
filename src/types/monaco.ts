import * as monacoTypes from "monaco-editor/esm/vs/editor/editor.api";

export type MonacoApiType = typeof monacoTypes;
export { monacoTypes };
export { ContentWidgetPositionPreference };

/**
 * Export concise references to Monaco types for use in the editor code.
 */
export type IEditorConstructionOptions = monacoTypes.editor.IEditorConstructionOptions;
export type IStandaloneCodeEditor = monacoTypes.editor.IStandaloneCodeEditor;
export type IModelDeltaDecoration = monacoTypes.editor.IModelDeltaDecoration;
export type IContentWidget = monacoTypes.editor.IContentWidget;
export type IContentWidgetPosition = monacoTypes.editor.IContentWidgetPosition;
const ContentWidgetPositionPreference = monacoTypes.editor.ContentWidgetPositionPreference;
