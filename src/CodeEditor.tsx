import { styled, Theme, withTheme } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import { RefObject, useCallback, useEffect, useImperativeHandle, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import { connect } from "react-redux";
import {
  actions,
  Path,
  Range,
  Selection,
  SourcedRange,
  SourceType,
  visibility
} from "santoku-store";
import { ChunkVersionOffsets, CodeEditorBaseProps, SnippetSelection } from "./selectors/types";
import {
  IEditorConstructionOptions,
  IModelDeltaDecoration,
  IStandaloneCodeEditor,
  MonacoApiType,
  monacoTypes
} from "./types/monaco";

/**
 * A code editor that shows a program built from multiple chunks. Maps edits and selections to
 * changes in the global store.
 *
 * The design of this code editor is roughly based on PullJosh's prototype of a controlled component
 * for react-monaco-editor: https://codesandbox.io/s/883y2zmp6l. Code on CodeSandbox is released
 * implicitly under MIT license: https://codesandbox.io/legal/terms.
 */
export const CodeEditor = (props: CodeEditorProps) => {
  const [editor, setEditor] = useState<IStandaloneCodeEditor | undefined>();
  const [monacoApi, setMonacoApi] = useState<MonacoApiType | undefined>();
  const [decorations, setDecorations] = useState<string[]>([]);
  const [editCallback, setEditCallback] = useState<monacoTypes.IDisposable | undefined>();
  const [selectionCallback, setSelectionCallback] = useState<monacoTypes.IDisposable | undefined>();

  useImperativeHandle(props.editorRef, () => editor, [editor]);
  useImperativeHandle(props.monacoApiRef, () => monacoApi, [monacoApi]);

  useEffect(() => {
    if (props.hidden !== true) {
      /*
       * If the editor is being shown, it needs to catch up on updates to state that it has ignored.
       */
      updateValue();
      updateSelections();
      updateDecorations();
      updateEditorHeight();
      forceEditorLayoutUpdate();
    }
  }, [props.hidden]);

  useEffect(() => {
    updateValue();
    updateEditorHeight();
  }, [props.text, editor]);

  useEffect(() => {
    updateSelections();
  }, [props.selections, editor]);

  useEffect(() => {
    updateLanguage();
  }, [props.path, editor]);

  useEffect(() => {
    updateDecorations();
  }, [props.visibilities, editor]);

  function updateValue() {
    if (props.hidden !== true && editor !== undefined && editor.hasTextFocus() === false) {
      editor.setValue(props.text);
    }
  }

  function updateLanguage() {
    if (editor !== undefined && monacoApi !== undefined) {
      const model = editor.getModel();
      if (model !== null) {
        /**
         * Use Monaco to detect the language of a model from a path.
         */
        const throwawayModel = monacoApi.editor.createModel(
          "",
          undefined,
          monacoApi.Uri.from({ scheme: "file", path: props.path })
        );
        monacoApi.editor.setModelLanguage(model, throwawayModel.getModeId());
        throwawayModel.dispose();
      }
    }
  }

  function updateSelections() {
    if (
      props.hidden !== true &&
      editor !== undefined &&
      editor.hasTextFocus() === false &&
      monacoApi !== undefined
    ) {
      const currentMonacoSelections = editor.getSelections();
      const monacoSelections = props.selections.map(s =>
        getMonacoSelectionFromSimpleSelection(monacoApi, s)
      );
      const selectionsChanged =
        currentMonacoSelections === null
          ? monacoSelections.length > 0
          : !monacoApi.Selection.selectionsArrEqual(monacoSelections, currentMonacoSelections);

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

  function updateDecorations() {
    if (props.hidden === true || editor === undefined) {
      return;
    }
    const newDecorations = props.visibilities
      .map((vis, i): IModelDeltaDecoration | undefined => {
        return vis === visibility.VISIBLE
          ? {
              options: {
                inlineClassName: "requested-visible",
                isWholeLine: true
              },
              range: {
                startLineNumber: i,
                endLineNumber: i,
                startColumn: 1,
                endColumn: Number.POSITIVE_INFINITY
              }
            }
          : undefined;
      })
      .filter((m): m is IModelDeltaDecoration => m !== undefined);
    setDecorations(editor.deltaDecorations(decorations, newDecorations));
  }

  function updateEditorHeight() {
    if (props.hidden === true || editor === undefined) {
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
        const heightBefore = container.style.height;
        const height = `${lineCount * lineHeight + horizontalScrollBarHeight}px`;
        if (height !== heightBefore) {
          container.style.height = `${lineCount * lineHeight + horizontalScrollBarHeight}px`;
          forceEditorLayoutUpdate();
        }
      }
    }
  }

  /*
   * Be very sparing will calling this method: it takes a long time to complete.
   */
  function forceEditorLayoutUpdate() {
    if (editor !== undefined) {
      editor.layout();
    }
  }

  const onDidChangeModelContent = useCallback(
    (event: monacoTypes.editor.IModelContentChangedEvent) => {
      if (editor !== undefined && editor.hasTextFocus() === true) {
        for (const change of event.changes) {
          const range = getRangeFromMonacoRange(change.range);
          const sourcedRange = getSourcedRangeFromRange(
            range,
            props.path,
            props.chunkVersionOffsets
          );
          if (sourcedRange !== null) {
            props.edit(sourcedRange, change.text);
          }
        }
      }
    },
    [editor, props.path, props.chunkVersionOffsets]
  );

  const onDidChangeCursorSelection = useCallback(
    (event: monacoTypes.editor.ICursorSelectionChangedEvent) => {
      if (monacoApi !== undefined && editor !== undefined && editor.hasTextFocus() === true) {
        props.setSelections(
          ...[event.selection]
            .concat(event.secondarySelections)
            .map(monacoSelection => {
              return getSnippetSelectionFromMonacoSelection(monacoApi, monacoSelection);
            })
            .map(snippetSelection => {
              return getSelectionFromSnippetSelection(
                snippetSelection,
                props.path,
                props.chunkVersionOffsets
              );
            })
            .filter((s): s is Selection => s !== null)
        );
      }
    },
    [editor, monacoApi, props.path, props.chunkVersionOffsets]
  );

  useEffect(
    function setListeners() {
      if (monacoApi !== undefined && editor !== undefined) {
        if (selectionCallback !== undefined) {
          selectionCallback.dispose();
        }
        setSelectionCallback(editor.onDidChangeCursorSelection(onDidChangeCursorSelection));
        if (editCallback !== undefined) {
          editCallback.dispose();
        }
        setEditCallback(editor.onDidChangeModelContent(onDidChangeModelContent));
      }
    },
    [editor, monacoApi, onDidChangeCursorSelection, onDidChangeModelContent]
  );

  useEffect(
    function setEditorTheme() {
      if (monacoApi !== undefined && props.theme !== undefined) {
        monacoApi.editor.defineTheme("santoku", {
          base: "vs",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": props.theme.palette.background.paper
          }
        });
        monacoApi.editor.setTheme("santoku");
      }
    },
    [monacoApi, props.theme]
  );

  const lineNumbers = props.lineNumbers;
  const editorOptions: IEditorConstructionOptions = {
    /*
     * Height of editor will be determined dynamically; the editor should never scroll.
     */
    scrollBeyondLastLine: false,
    /*
     * Remove visual distractors from the margins of the editor.
     */
    minimap: { enabled: false },
    overviewRulerLanes: 0,
    lineNumbers:
      lineNumbers === undefined
        ? "on"
        : lineNumber => {
            const i = lineNumber - 1;
            return i < lineNumbers.length ? lineNumbers[i].toString() : "N/A";
          }
  };

  if (props.theme !== undefined) {
    const { fontFamily, fontSize } = props.theme.typography.code;
    editorOptions.fontFamily = fontFamily;
    if (typeof fontSize === "number") {
      editorOptions.fontSize = fontSize;
    }
  }

  return (
    <div
      hidden={props.hidden === true}
      className={`${props.className !== undefined && props.className}`}
    >
      <MonacoEditor
        editorDidMount={(e: IStandaloneCodeEditor, m) => {
          setEditor(e);
          setMonacoApi(m);
        }}
        options={editorOptions}
      />
    </div>
  );
};

function getRangeFromMonacoRange(monacoRange: monacoTypes.IRange): Range {
  return {
    start: { line: monacoRange.startLineNumber, character: monacoRange.startColumn - 1 },
    end: { line: monacoRange.endLineNumber, character: monacoRange.endColumn - 1 }
  };
}

function getSourcedRangeFromRange(
  range: Range,
  path: Path,
  chunkVersionOffsets: ChunkVersionOffsets
): SourcedRange | null {
  for (let i = chunkVersionOffsets.length - 1; i >= 0; i--) {
    const { line, chunkVersionId } = chunkVersionOffsets[i];
    if (range.start.line >= line) {
      return {
        start: { ...range.start, line: range.start.line - line + 1 },
        end: { ...range.end, line: range.end.line - line + 1 },
        path,
        relativeTo: { source: SourceType.CHUNK_VERSION, chunkVersionId }
      };
    }
  }
  return null;
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

interface CodeEditorProps extends CodeEditorOwnProps, EditorActions {
  className?: string;
  theme?: Theme;
}

export interface CodeEditorOwnProps extends CodeEditorBaseProps {
  /**
   * Custom line numbers to put in the left margin. If line numbers are defined, there must be one
   * defined for every line of text.
   */
  lineNumbers?: number[];
  /**
   * Use to notify the editor if it's no longer hidden, so that it can repaint.
   */
  hidden?: boolean;
  /**
   * Reference to the Monaco code editor, for components extending this one.
   */
  editorRef?: RefObject<IStandaloneCodeEditor | undefined>;
  /**
   * Reference to Monaco API, for components extending this one.
   */
  monacoApiRef?: RefObject<MonacoApiType | undefined>;
}

interface EditorActions {
  edit: typeof actions.code.edit;
  setSelections: typeof actions.code.setSelections;
}

const editorActionCreators = {
  edit: actions.code.edit,
  setSelections: actions.code.setSelections
};

const StyledCodeEditor = styled(withTheme(CodeEditor))(({ theme }) => ({
  /*
   * Check the declaration of the markers for full control over the appearance of lines. For
   * example, the marker may have been declared to be "in front" of the text, which will make
   * the text partly invisible.
   */
  "& .requested-visible": {
    opacity: 0.5
  },
  /*
   * Give code cell a light left border so that it's obvious that this cell aligns with other cell
   * contents, despite the line gutter on the code editor.
   */
  borderLeftStyle: "solid",
  borderLeftWidth: theme.spacing(1),
  borderLeftColor: theme.palette.primary.main,
  /*
   * Make the border span the entire height of the cell.
   */
  paddingTop: theme.spaces.cell.paddingTop,
  paddingBottom: theme.spaces.cell.paddingBottom,
  marginTop: -theme.spaces.cell.paddingTop,
  marginBottom: -theme.spaces.cell.paddingBottom
}));

const MemoizedCodeEditor = React.memo(StyledCodeEditor, _.isEqual);

export default connect(
  undefined,
  editorActionCreators
)(MemoizedCodeEditor);
