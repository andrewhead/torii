import * as monacoTypes from "monaco-editor/esm/vs/editor/editor.api";
import * as React from "react";
import { useEffect, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import { actions, Path, Selection, store } from "santoku-store";
import { SourceType } from "santoku-store/dist/text/types";
import { ChunkVersionOffsets, Reason, SnippetSelection } from "./selectors/types";

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
    updateValue();
    updateSelections();
    updateEditorHeight();
  });

  function updateValue() {
    if (editor !== undefined) {
      if (editor.getValue() !== props.text) {
        editor.setValue(props.text);
      }
    }
  }

  function updateSelections() {
    if (editor !== undefined && monacoApi !== undefined) {
      const currentMonacoSelections = editor.getSelections();
      const monacoSelections = props.selections.map(s =>
        getMonacoSelectionFromSimpleSelection(monacoApi, s)
      );
      const selectionsChanged =
        currentMonacoSelections === null
          ? monacoSelections.length > 0
          : !monacoApi.Selection.selectionsArrEqual(monacoSelections, currentMonacoSelections);
      /*
       * TODO(andrewhead): Clear selections when set to 0 (only seems to be the case when
       * the editors are initialized).
       */
      if (selectionsChanged && monacoSelections.length > 0) {
        editor.setSelections(monacoSelections);
      } else if (monacoSelections.length === 0) {
        /**
         * It's not possible to setSelections to an empty list of selections for Monaco editor,
         * as the editor will throw an error. Instead, remove the selection by collapsing the
         * first selection to the start of the line.
         */
        if (currentMonacoSelections !== null && currentMonacoSelections.length > 0) {
          const firstSelection = currentMonacoSelections[0].collapseToStart();
          editor.setSelection(firstSelection);
        }
      }
    }
  }

  function updateEditorHeight() {
    if (editor === undefined) {
      return;
    }
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
  }

  return (
    <MonacoEditor
      theme="vscode"
      editorDidMount={(e: IStandaloneCodeEditor, m) => {
        setEditor(e);
        setMonacoApi(m);
        e.onDidChangeCursorSelection(
          onDidChangeCursorSelection(m, props.path, props.chunkVersionOffsets)
        );
      }}
      value={props.text}
      onChange={value => {
        // TODO(andrewhead): Replace with setting value of the text.
      }}
      options={{
        /*
         * Height of editor will be determined dynamically; the editor should never scroll.
         */
        scrollBeyondLastLine: false
      }}
    />
  );
}

function onDidChangeCursorSelection(
  monacoApi: MonacoApiType,
  path: Path,
  chunkVersionOffsets: ChunkVersionOffsets
) {
  return (event: monacoTypes.editor.ICursorSelectionChangedEvent) => {
    store.dispatch(
      actions.text.setSelections(
        ...[event.selection, ...event.secondarySelections]
          .map(monacoSelection => {
            return getSnippetSelectionFromMonacoSelection(monacoApi, monacoSelection);
          })
          .map(snippetSelection => {
            return getSelectionFromSnippetSelection(snippetSelection, path, chunkVersionOffsets);
          })
          .filter((s): s is Selection => s !== null)
      )
    );
  };
}

/**
 * Assumes all selections fit within a single chunk version's text. The caller is responsible for
 * adjusting selections so they fit in a single chunk version's text before calling this method.
 */
export function getSelectionFromSnippetSelection(
  snippetSelection: SnippetSelection,
  path: Path,
  chunkVersionOffsets: ChunkVersionOffsets
): Selection | null {
  for (let i = chunkVersionOffsets.length - 1; i >= 0; i--) {
    const { line, chunkVersionId } = chunkVersionOffsets[i];
    if (snippetSelection.active.line >= line && snippetSelection.anchor.line >= line) {
      return {
        anchor: { ...snippetSelection.anchor, line: snippetSelection.anchor.line - line + 1 },
        active: { ...snippetSelection.active, line: snippetSelection.active.line - line + 1 },
        path,
        relativeTo: { source: SourceType.CHUNK_VERSION, chunkVersionId }
      };
    }
  }
  return null;
}

/*
 * Refactor into simple selection creator and Monaco selection converter. Simple logic and more complex.
 */
export function getSnippetSelectionFromMonacoSelection(
  monacoApi: MonacoApiType,
  monacoSelection: monacoTypes.Selection
): SnippetSelection {
  const start = {
    line: monacoSelection.startLineNumber,
    character: monacoSelection.startColumn - 1
  };
  const end = { line: monacoSelection.endLineNumber, character: monacoSelection.endColumn - 1 };
  return monacoSelection.getDirection() === monacoApi.SelectionDirection.LTR
    ? { anchor: start, active: end }
    : { anchor: end, active: start };
}

function getMonacoSelectionFromSimpleSelection(
  monacoApi: MonacoApiType,
  selection: SnippetSelection
): monacoTypes.Selection {
  return new monacoApi.Selection(
    selection.anchor.line,
    selection.anchor.character + 1,
    selection.active.line,
    selection.active.character + 1
  );
}

interface CodePreviewProps {
  text: string;
  reasons: Reason[];
  selections: SnippetSelection[];
  chunkVersionOffsets: ChunkVersionOffsets;
  path: Path;
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
