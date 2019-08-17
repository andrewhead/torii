import * as monacoTypes from "monaco-editor/esm/vs/editor/editor.api";
import * as React from "react";
import { useEffect, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import { Reason } from "./selectors/snippet";

type MonacoApiType = typeof monacoTypes;
type IStandaloneCodeEditor = monacoTypes.editor.IStandaloneCodeEditor;

/**
 * The design of this code preview was based on PullJosh's prototype of a controlled component
 * for react-monaco-editor: https://codesandbox.io/s/883y2zmp6l. Code on CodeSandbox is released
 * implicitly under MIT license: https://codesandbox.io/legal/terms.
 */
export function CodePreview(props: CodePreviewProps) {
  const [editor, setEditor] = useState<IStandaloneCodeEditor | undefined>(undefined);
  const [monacoApi, setMonacoApi] = useState<MonacoApiType | undefined>(undefined);

  useEffect(() => {
    if (editor === undefined) {
      return;
    }

    editor.setValue(props.text);

    /*
     * Dynamically adjust the height of the editor to its content. Based on the fix suggested in
     * https://github.com/microsoft/monaco-editor/issues/103#issuecomment-438872047.
     */
    const lineHeight = editor.getConfiguration().lineHeight;
    const container = editor.getDomNode();
    const textModel = editor.getModel();
    const horizontalScrollBarHeight = editor.getConfiguration().layoutInfo
      .horizontalScrollbarHeight;
    if (textModel !== null) {
      const lineCount = textModel.getLineCount();
      if (container !== null) {
        container.style.height = `${lineCount * lineHeight + horizontalScrollBarHeight}px`;
        /*
         * Force adjustment of editor height.
         */
        editor.layout();
      }
    }
  });

  return (
    <MonacoEditor
      theme="vscode"
      editorDidMount={(e: IStandaloneCodeEditor, m) => {
        setEditor(e);
        setMonacoApi(m);
      }}
      value={props.text}
      onChange={value => {
        // TODO(andrewhead): Replace with setting value of the text.
      }}
      options={{
        /*
         * Height of editor will be determined dynamically; the editor should never scroll at all.
         */
        scrollBeyondLastLine: false
      }}
    />
  );
}

interface CodePreviewProps {
  text: string;
  reasons: Reason[];
}

/*
  const markers = props.reasons
    .map(
      (reason, i): IMarker | undefined => {
        return reason === Reason.REQUESTED_VISIBLE
          ? {
              className: "requested-visible",
              endCol: Number.POSITIVE_INFINITY,
              endRow: i,
              // /*
              //  * Place marker in front because we want to use it to partially hide code: it's
              //  * to occlude code by putting the marker in front of it.
              //  
              inFront: true,
              startCol: 0,
              startRow: i,
              type: "fullLine"
            }
          : undefined;
      }
    )
    .filter(m => m !== undefined);
    */
