import { ChunkVersionId, selectors, SnippetId, State } from "torii-store";

export function isLinked(
  state: State,
  chunkVersionId: ChunkVersionId,
  snippetId: SnippetId
): boolean {
  const stateSlice = state.undoable.present;
  const snippet = stateSlice.snippets.byId[snippetId];
  if (snippet.chunkVersionsAdded.indexOf(chunkVersionId) === -1) {
    return true;
  }
  return isReferenceImplementation(state, chunkVersionId);
}

function isReferenceImplementation(
  state: State,
  chunkVersionId: ChunkVersionId
) {
  const stateSlice = state.undoable.present;
  const chunkVersion = stateSlice.chunkVersions.byId[chunkVersionId];
  const chunk = stateSlice.chunks.byId[chunkVersion.chunk];
  return chunk.versions.indexOf(chunkVersionId) === 0;
}

/**
 * A chunk version can instantly be merged into the prior chunk version if no changes have been
 * made to the text between the two versions.
 */
export function canInstantMerge(
  state: State,
  chunkVersionId: ChunkVersionId,
  snippetId: SnippetId
): boolean {
  if (isLinked(state, chunkVersionId, snippetId)) {
    return false;
  }
  const stateSlice = state.undoable.present;
  const previousVersionId = selectors.code.findIdOfPreviousChunkVersion(
    stateSlice,
    snippetId,
    chunkVersionId
  );
  if (previousVersionId === null) {
    return false;
  }
  const currentVersion = stateSlice.chunkVersions.byId[chunkVersionId];
  const previousVersion = stateSlice.chunkVersions.byId[previousVersionId];
  return previousVersion.text === currentVersion.text;
}
