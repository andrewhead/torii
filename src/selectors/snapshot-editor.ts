import _ from "lodash";
import {
  ChunkVersionId,
  ChunkVersionOffsets,
  ContentType,
  LineText,
  Path,
  selectors,
  SnippetId,
  State
} from "santoku-store";
import { IModelDecorationOptions, IModelDeltaDecoration } from "../types/monaco";
import { SnapshotEditorBaseProps, SnippetOffsets } from "./types";

export function getSnapshotEditorProps(
  state: State,
  snippetId: SnippetId,
  path: Path
): SnapshotEditorBaseProps {
  const { partialProgram, lineTexts } = selectors.code.getSnapshotPartialProgram(
    state,
    snippetId,
    path
  );
  return { ...partialProgram, snippetOffsets: getSnippetOffsets(state, lineTexts) };
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
    const startLine = offset.line;
    const endLine = nextOffset !== undefined ? nextOffset.line - 1 : Number.POSITIVE_INFINITY;
    const isCurrentSnippet = offset.snippetId === currentSnippet;
    const className = "snippet-range " + (isCurrentSnippet ? "current-snippet" : "past-snippet");
    decorations.push(lineRangeDecoration(startLine, endLine, { className }));
  }
  return decorations;
}

export function getSelectedChunkVersionDecorations(
  chunkVersionId: ChunkVersionId | undefined,
  chunkVersionOffsets: ChunkVersionOffsets
) {
  const decorations = [];
  if (chunkVersionId === undefined) {
    return [];
  }
  const chunkVersionIndex = chunkVersionOffsets.map(o => o.chunkVersionId).indexOf(chunkVersionId);
  if (chunkVersionIndex !== -1) {
    const topLine = chunkVersionOffsets[chunkVersionIndex].line;
    const bottomLine =
      chunkVersionIndex < chunkVersionOffsets.length - 1
        ? chunkVersionOffsets[chunkVersionIndex + 1].line - 1
        : Number.POSITIVE_INFINITY;
    if (chunkVersionIndex > 0) {
      decorations.push(
        lineRangeDecoration(topLine, topLine, { className: "selected-chunk-version-top-boundary" })
      );
    }
    decorations.push(
      lineRangeDecoration(topLine, bottomLine, { className: "selected-chunk-version-body" })
    );
    if (chunkVersionIndex < chunkVersionOffsets.length - 1) {
      decorations.push(
        lineRangeDecoration(bottomLine, bottomLine, {
          className: "selected-chunk-version-bottom-boundary"
        })
      );
    }
  }
  return decorations;
}

function lineRangeDecoration(
  startLine: number,
  endLine: number,
  options?: IModelDecorationOptions
) {
  const baseOptions = { isWholeLine: true };
  options = _.merge({}, baseOptions, options);
  return {
    range: {
      startLineNumber: startLine,
      startColumn: 0,
      endLineNumber: endLine,
      endColumn: Number.POSITIVE_INFINITY
    },
    options
  };
}
