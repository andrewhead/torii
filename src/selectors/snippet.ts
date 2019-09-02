import _ from "lodash";
import {
  Chunk,
  ChunkVersionId,
  Path,
  Selection,
  SnippetId,
  SourceType,
  textUtils,
  Undoable,
  visibility
} from "santoku-store";
import { ChunkVersionOffsets, CodeEditorProps, LineText, Reason, SnippetSelection } from "./types";

export function getSnippetPaths(state: Undoable, snippetId: SnippetId) {
  let paths: Path[] = [];
  for (const chunkVersionId of getVisibleChunkVersions(state, snippetId)) {
    const { path } = getChunk(state, chunkVersionId).location;
    paths = _.unionWith(paths, [path]);
  }
  return paths;
}

export function getSnippetEditorProps(
  state: Undoable,
  snippetId: SnippetId,
  path: Path
): CodeEditorProps {
  const sortedChunkVersions = getSortedChunkVersions(state, snippetId, path);
  const lineTexts = getTextForPath(state, sortedChunkVersions, snippetId);
  return {
    path,
    reasons: lineTexts.map(lt => lt.reason),
    text: textUtils.join(...lineTexts.map(lt => lt.text)),
    selections: getSnippetSelections(state, sortedChunkVersions),
    chunkVersionOffsets: getChunkVersionOffsets(state, sortedChunkVersions)
  };
}

/**
 * Get IDs of all chunk versions that should be showing for a snippet.
 */
function getVisibleChunkVersions(state: Undoable, snippetId: SnippetId): ChunkVersionId[] {
  const snippet = state.snippets.byId[snippetId];
  const chunkVersionIds = [...snippet.chunkVersionsAdded];
  const snippetVisibilityRules = state.visibilityRules[snippetId];
  if (snippetVisibilityRules !== undefined) {
    chunkVersionIds.push(...Object.keys(snippetVisibilityRules));
  }
  return chunkVersionIds;
}

/**
 * Gets sorted lists of chunk versions in this snippet, grouped by path.
 */
function getSortedChunkVersions(
  state: Undoable,
  snippetId: SnippetId,
  path: Path
): ChunkVersionId[] {
  const chunkVersionIds = getVisibleChunkVersions(state, snippetId);
  const filtered = chunkVersionIds.filter(chunkVersionId => {
    const chunk = getChunk(state, chunkVersionId);
    return _.isEqual(chunk.location.path, path);
  });
  filtered.sort((chunkVersionId1, chunkVersionId2) => {
    const chunk1 = getChunk(state, chunkVersionId1);
    const chunk2 = getChunk(state, chunkVersionId2);
    return chunk1.location.line - chunk2.location.line;
  });
  return filtered;
}

function getTextForPath(
  state: Undoable,
  sortedChunkVersions: ChunkVersionId[],
  snippetId: SnippetId
): LineText[] {
  const lineTexts: LineText[] = [];
  for (const chunkVersionId of sortedChunkVersions) {
    const chunkVersion = state.chunkVersions.byId[chunkVersionId];
    const { chunk: chunkId, text: chunkVersionText } = chunkVersion;
    const lines = textUtils.split(chunkVersionText);
    const isAddedInThisSnippet = isAddedInSnippet(state, chunkVersionId, snippetId);
    const linesAddedForChunkVersion = 0;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const lineVisibility = getVisibility(state, snippetId, chunkVersionId, lineIndex);
      let lineReason: Reason | undefined;
      if (isAddedInThisSnippet && lineVisibility !== visibility.HIDDEN) {
        lineReason = Reason.ADDED;
      } else if (lineVisibility === visibility.VISIBLE) {
        lineReason = Reason.REQUESTED_VISIBLE;
      }
      if (lineReason !== undefined) {
        lineTexts.push({
          chunkId,
          chunkVersionId,
          offset: linesAddedForChunkVersion,
          reason: lineReason,
          text: lines[lineIndex]
        });
      }
    }
  }
  return lineTexts;
}

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

function isAddedInSnippet(state: Undoable, chunkVersionId: ChunkVersionId, snippetId: SnippetId) {
  return state.snippets.byId[snippetId].chunkVersionsAdded.indexOf(chunkVersionId) !== -1;
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

/**
 * Assumes a valid 'chunkVersionId' that is already in 'state'.
 */
function getChunk(state: Undoable, chunkVersionId: ChunkVersionId): Chunk {
  return state.chunks.byId[state.chunkVersions.byId[chunkVersionId].chunk];
}
