import { ContentType, Path, selectors, SnippetId, State } from "santoku-store";
import { IModelDeltaDecoration } from "../types/monaco";
import { getCodeEditorBaseProps } from "./code-editor";
import { LineText, SnapshotEditorBaseProps, SnippetOffsets } from "./types";

export function getSnapshotEditorProps(
  state: State,
  snippetId: SnippetId,
  path: Path
): SnapshotEditorBaseProps {
  const orderedChunkVersions = selectors.code.getSnapshotOrderedChunkVersions(
    state,
    snippetId,
    path
  );
  const { props, lineTexts } = getCodeEditorBaseProps(state, snippetId, path, orderedChunkVersions);
  return { ...props, snippetOffsets: getSnippetOffsets(state, lineTexts) };
}

function getSnippetOffsets(state: State, lineTexts: LineText[]): SnippetOffsets {
  const cells = state.undoable.present.cells;
  const orderedSnippetIds = cells.all
    .map(id => cells.byId[id])
    .filter(cell => cell.type === ContentType.SNIPPET)
    .map(cell => cell.contentId);
  const offsets = [];
  let lastSnippetIndex;
  for (let i = 0; i < lineTexts.length; i++) {
    const { snippetId } = lineTexts[i];
    const snippetIndex = orderedSnippetIds.indexOf(snippetId);
    if (snippetIndex !== lastSnippetIndex) {
      offsets.push({ snippetId, snippetIndex, line: i + 1 });
    }
    lastSnippetIndex = snippetIndex;
  }
  return offsets;
}

export function getSnippetRangeDecorations(
  snippetOffsets: SnippetOffsets,
  currentSnippet: SnippetId
) {
  const decorations: IModelDeltaDecoration[] = [];
  for (let i = 0; i < snippetOffsets.length; i++) {
    const offset = snippetOffsets[i];
    const nextOffset = snippetOffsets[i + 1];
    decorations.push({
      options: snippetRangeDecorationOptions(offset.snippetId === currentSnippet),
      range: {
        startLineNumber: offset.line,
        startColumn: 0,
        endLineNumber: nextOffset !== undefined ? nextOffset.line - 1 : Number.POSITIVE_INFINITY,
        endColumn: Number.POSITIVE_INFINITY
      }
    });
  }
  return decorations;
}

function snippetRangeDecorationOptions(isCurrentSnippet: boolean) {
  return {
    isWholeLine: true,
    className: "snippet-range " + (isCurrentSnippet ? "current-snippet" : "past-snippet")
  };
}
