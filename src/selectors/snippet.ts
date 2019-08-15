import {
  Chunk,
  ChunkId,
  ChunkVersionId,
  Path,
  SnippetId,
  Text,
  textUtils,
  visibility
} from "santoku-store";

export function getSnippetText(state: Text, snippetId: SnippetId): SnippetText {
  const sortedChunkVersions = getSortedChunkVersions(state, snippetId);
  const snippetText: SnippetText = { paths: [], byPath: {} };
  for (const path of Object.keys(sortedChunkVersions)) {
    const lineTexts = getTextForPath(state, sortedChunkVersions[path], snippetId);
    snippetText.paths.push(path);
    snippetText.byPath[path] = {
      reasons: lineTexts.map(lt => lt.reason),
      text: textUtils.join(...lineTexts.map(lt => lt.text))
    };
  }
  return snippetText;
}

export interface SnippetText {
  paths: Path[];
  byPath: {
    [path: string]: PathSnippetText;
  };
}

interface PathSnippetText {
  text: string;
  reasons: Reason[];
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

interface LineText {
  text: string;
  chunkId: ChunkId;
  chunkVersionId: ChunkVersionId;
  /**
   * Offset of line within chunk version text. Starts at 0.
   */
  offset: number;
  reason: Reason;
}

/**
 * Assumes a valid 'chunkVersionId' that is already in 'state'.
 */
function getChunk(state: Text, chunkVersionId: ChunkVersionId): Chunk {
  return state.chunks.byId[state.chunkVersions.byId[chunkVersionId].chunk];
}

interface ChunkVersionsByPath {
  [path: string]: ChunkVersionId[];
}

export enum Reason {
  ADDED,
  REQUESTED_VISIBLE
}
