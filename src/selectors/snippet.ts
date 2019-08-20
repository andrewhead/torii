import {
  Chunk,
  ChunkVersionId,
  Selection,
  SnippetId,
  SourceType,
  Text,
  textUtils,
  visibility
} from "santoku-store";
import {
  ChunkVersionOffsets,
  ChunkVersionsByPath,
  LineText,
  Reason,
  SnippetSelection,
  SnippetText
} from "./types";

export function getSnippetText(state: Text, snippetId: SnippetId): SnippetText {
  const sortedChunkVersions = getSortedChunkVersions(state, snippetId);
  const snippetText: SnippetText = { paths: [], byPath: {} };
  for (const path of Object.keys(sortedChunkVersions)) {
    const lineTexts = getTextForPath(state, sortedChunkVersions[path], snippetId);
    snippetText.paths.push(path);
    snippetText.byPath[path] = {
      reasons: lineTexts.map(lt => lt.reason),
      text: textUtils.join(...lineTexts.map(lt => lt.text)),
      selections: getSnippetSelections(state, sortedChunkVersions[path]),
      chunkVersionOffsets: getChunkVersionOffsets(state, sortedChunkVersions[path])
    };
  }
  return snippetText;
}

/**
 * Gets sorted lists of chunk versions in this snippet, grouped by path.
 */
function getSortedChunkVersions(state: Text, snippetId: SnippetId): ChunkVersionsByPath {
  const snippet = state.snippets.byId[snippetId];
  const chunkVersionIds = [...snippet.chunkVersionsAdded];
  const snippetVisibilityRules = state.visibilityRules[snippetId];
  if (snippetVisibilityRules !== undefined) {
    chunkVersionIds.push(...Object.keys(snippetVisibilityRules));
  }
  const chunkVersionIdsByPath = chunkVersionIds.reduce(
    (orderedChunkVersions, chunkVersionId) => {
      const chunk = getChunk(state, chunkVersionId);
      const { path } = chunk.location;
      const chunkVersionList = orderedChunkVersions[path] || [];
      return {
        ...orderedChunkVersions,
        [path]: chunkVersionList.concat(chunkVersionId)
      };
    },
    {} as ChunkVersionsByPath
  );
  for (const path of Object.keys(chunkVersionIdsByPath)) {
    chunkVersionIdsByPath[path].sort((chunkVersionId1, chunkVersionId2) => {
      const chunk1 = getChunk(state, chunkVersionId1);
      const chunk2 = getChunk(state, chunkVersionId2);
      return chunk1.location.line - chunk2.location.line;
    });
  }
  return chunkVersionIdsByPath;
}

function getTextForPath(
  state: Text,
  sortedChunkVersions: ChunkVersionId[],
  snippetId: SnippetId
): LineText[] {
  const lineTexts: LineText[] = [];
  for (const chunkVersionId of sortedChunkVersions) {
    const chunkVersion = state.chunkVersions.byId[chunkVersionId];
    const { chunk: chunkId, text: chunkVersionText } = chunkVersion;
    const lines = textUtils.toLines(chunkVersionText);
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
  state: Text,
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
    offset += textUtils.toLines(chunkVersionText).length;
  }
  return snippetSelections;
}

function getSnippetSelectionsForChunkVersion(
  state: Text,
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
  state: Text,
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
  const lineCount = textUtils.toLines(chunkText).length;
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
  state: Text,
  orderedChunkVersions: ChunkVersionId[]
): ChunkVersionOffsets {
  let line = 1;
  const chunkVersionOffsets = [];
  for (const chunkVersionId of orderedChunkVersions) {
    chunkVersionOffsets.push({ line, chunkVersionId });
    const chunkVersionText = state.chunkVersions.byId[chunkVersionId].text;
    line += textUtils.toLines(chunkVersionText).length;
  }
  return chunkVersionOffsets;
}

function isAddedInSnippet(state: Text, chunkVersionId: ChunkVersionId, snippetId: SnippetId) {
  return state.snippets.byId[snippetId].chunkVersionsAdded.indexOf(chunkVersionId) !== -1;
}

function getVisibility(
  state: Text,
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
function getChunk(state: Text, chunkVersionId: ChunkVersionId): Chunk {
  return state.chunks.byId[state.chunkVersions.byId[chunkVersionId].chunk];
}
