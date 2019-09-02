import _ from "lodash";
import {
  ChunkVersionId,
  Path,
  Selection,
  selectors,
  SnippetId,
  SourceType,
  State,
  textUtils,
  Undoable,
  visibility
} from "santoku-store";
import { getChunk, getVisibleChunkVersions, isAddedInSnippet } from "./snippet";
import { ChunkVersionOffsets, CodeEditorProps, LineText, SnippetSelection } from "./types";

export function getSnapshotEditorProps(state: State, snippetId: SnippetId, path: Path) {
  const orderedChunkVersions = selectors.code.getSnapshotOrderedChunkVersions(
    state,
    snippetId,
    path
  );
  return getEditorProps(state, snippetId, path, orderedChunkVersions);
}

export function getSnippetEditorProps(state: State, snippetId: SnippetId, path: Path) {
  const orderedChunkVersions = getSnippetOrderedChunkVersions(state, snippetId, path);
  function lineFilter(chunkVersionId: ChunkVersionId, vis: visibility.Visibility | undefined) {
    const isAddedInThisSnippet = isAddedInSnippet(state, chunkVersionId, snippetId);
    return isAddedInThisSnippet || vis === visibility.VISIBLE;
  }
  return getEditorProps(state, snippetId, path, orderedChunkVersions, lineFilter);
}

/**
 * Gets sorted lists of chunk versions in this snippet, grouped by path.
 */
function getSnippetOrderedChunkVersions(
  state: State,
  snippetId: SnippetId,
  path: Path
): ChunkVersionId[] {
  const stateSlice = state.undoable.present;
  const chunkVersionIds = getVisibleChunkVersions(state, snippetId);
  const filtered = chunkVersionIds.filter(chunkVersionId => {
    const chunk = getChunk(stateSlice, chunkVersionId);
    return _.isEqual(chunk.location.path, path);
  });
  filtered.sort((chunkVersionId1, chunkVersionId2) => {
    const chunk1 = getChunk(stateSlice, chunkVersionId1);
    const chunk2 = getChunk(stateSlice, chunkVersionId2);
    return chunk1.location.line - chunk2.location.line;
  });
  return filtered;
}

function getEditorProps(
  state: State,
  snippetId: SnippetId,
  path: Path,
  sortedChunkVersions: ChunkVersionId[],
  filter?: LineFilter
): CodeEditorProps {
  const stateSlice = state.undoable.present;
  const lineTexts: LineText[] = [];
  for (const chunkVersionId of sortedChunkVersions) {
    const chunkVersion = stateSlice.chunkVersions.byId[chunkVersionId];
    const { chunk: chunkId, text: chunkVersionText } = chunkVersion;
    const lines = textUtils.split(chunkVersionText);

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const lineVisibility = getVisibility(stateSlice, snippetId, chunkVersionId, lineIndex);
      if (filter === undefined || filter(chunkVersionId, lineVisibility)) {
        lineTexts.push({
          chunkId,
          chunkVersionId,
          offset: lineIndex,
          visibility: lineVisibility,
          text: lines[lineIndex]
        });
      }
    }
  }
  return {
    path,
    visibilities: lineTexts.map(lt => lt.visibility),
    text: textUtils.join(...lineTexts.map(lt => lt.text)),
    selections: getSnippetSelections(stateSlice, sortedChunkVersions),
    chunkVersionOffsets: getChunkVersionOffsets(stateSlice, sortedChunkVersions)
  };
}

type LineFilter = (
  chunkVersionId: ChunkVersionId,
  visibility: visibility.Visibility | undefined
) => boolean;

/**
 * Assumes all chunk versions IDs are present in the state.
 */
function getSnippetSelections(
  state: Undoable,
  orderedChunkVersions: ChunkVersionId[]
): SnippetSelection[] {
  let offset = 0;
  const snippetSelections = [];
  for (const chunkVersionId of orderedChunkVersions) {
    snippetSelections.push(
      ...getSnippetSelectionsForChunkVersion(state, chunkVersionId, offset),
      ...getSnippetSelectionsFromReferenceImplementation(state, chunkVersionId, offset)
    );
    const chunkVersionText = state.chunkVersions.byId[chunkVersionId].text;
    offset += textUtils.split(chunkVersionText).length;
  }
  return snippetSelections;
}

function getSnippetSelectionsForChunkVersion(
  state: Undoable,
  chunkVersionId: ChunkVersionId,
  offset: number
) {
  return state.selections
    .filter(
      s =>
        s.relativeTo.source === SourceType.CHUNK_VERSION &&
        s.relativeTo.chunkVersionId === chunkVersionId
    )
    .map(s => getSnippetSelectionFromSelection(s, offset));
}

function getSnippetSelectionsFromReferenceImplementation(
  state: Undoable,
  chunkVersionId: ChunkVersionId,
  offsetInSnippet: number
) {
  const { chunk: chunkId, text: chunkText } = state.chunkVersions.byId[chunkVersionId];
  const chunk = state.chunks.byId[chunkId];
  const versionIndex = chunk.versions.indexOf(chunkVersionId);
  /*
   * A selection in a reference implementation should only map to unchanged copies in the snippet.
   */
  if (versionIndex !== 0) {
    return [];
  }
  const { line: chunkOffset, path } = chunk.location;
  const lineCount = textUtils.split(chunkText).length;
  const chunkRange = {
    start: { line: chunkOffset, character: 0 },
    end: { line: chunkOffset + lineCount - 1, character: Number.POSITIVE_INFINITY }
  };
  return state.selections
    .filter(s => s.relativeTo.source === SourceType.REFERENCE_IMPLEMENTATION && s.path === path)
    .map(s => textUtils.intersect(s, chunkRange))
    .filter((s): s is Selection => s !== null)
    .map(s => getSnippetSelectionFromSelection(s, -chunkOffset + 1 + offsetInSnippet));
}

function getSnippetSelectionFromSelection(selection: Selection, offset: number) {
  return {
    anchor: { ...selection.anchor, line: selection.anchor.line + offset },
    active: { ...selection.active, line: selection.active.line + offset }
  };
}

function getChunkVersionOffsets(
  state: Undoable,
  orderedChunkVersions: ChunkVersionId[]
): ChunkVersionOffsets {
  let line = 1;
  const chunkVersionOffsets = [];
  for (const chunkVersionId of orderedChunkVersions) {
    chunkVersionOffsets.push({ line, chunkVersionId });
    const chunkVersionText = state.chunkVersions.byId[chunkVersionId].text;
    line += textUtils.split(chunkVersionText).length;
  }
  return chunkVersionOffsets;
}

function getVisibility(
  state: Undoable,
  snippetId: SnippetId,
  chunkVersionId: ChunkVersionId,
  line: number
): visibility.Visibility | undefined {
  if (state.visibilityRules[snippetId] !== undefined) {
    if (state.visibilityRules[snippetId][chunkVersionId] !== undefined) {
      return state.visibilityRules[snippetId][chunkVersionId][line];
    }
  }
  return undefined;
}
