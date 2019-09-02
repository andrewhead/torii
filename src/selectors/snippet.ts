import _ from "lodash";
import { Chunk, ChunkVersionId, Path, SnippetId, State, Undoable } from "santoku-store";

export function getSnippetPaths(state: State, snippetId: SnippetId) {
  const stateSlice = state.undoable.present;
  let paths: Path[] = [];
  for (const chunkVersionId of getVisibleChunkVersions(state, snippetId)) {
    const { path } = getChunk(stateSlice, chunkVersionId).location;
    paths = _.unionWith(paths, [path]);
  }
  return paths;
}

/**
 * Get IDs of all chunk versions that should be showing for a snippet.
 */
export function getVisibleChunkVersions(state: State, snippetId: SnippetId): ChunkVersionId[] {
  const stateSlice = state.undoable.present;
  const snippet = stateSlice.snippets.byId[snippetId];
  const chunkVersionIds = [...snippet.chunkVersionsAdded];
  const snippetVisibilityRules = stateSlice.visibilityRules[snippetId];
  if (snippetVisibilityRules !== undefined) {
    chunkVersionIds.push(...Object.keys(snippetVisibilityRules));
  }
  return chunkVersionIds;
}

export function isAddedInSnippet(
  state: State,
  chunkVersionId: ChunkVersionId,
  snippetId: SnippetId
) {
  const snippets = state.undoable.present.snippets;
  return snippets.byId[snippetId].chunkVersionsAdded.indexOf(chunkVersionId) !== -1;
}

/**
 * Assumes a valid 'chunkVersionId' that is already in 'state'.
 */
export function getChunk(state: Undoable, chunkVersionId: ChunkVersionId): Chunk {
  return state.chunks.byId[state.chunkVersions.byId[chunkVersionId].chunk];
}
