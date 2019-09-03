import _ from "lodash";
import { ChunkVersionId, Path, SnippetId, State, visibility } from "santoku-store";
import { getCodeEditorProps } from "./code-editor";
import { getChunk, getVisibleChunkVersions, isAddedInSnippet } from "./snippet";
import { BaseCodeEditorProps } from "./types";

export function getSnippetEditorProps(
  state: State,
  snippetId: SnippetId,
  path: Path
): BaseCodeEditorProps {
  const orderedChunkVersions = getSnippetOrderedChunkVersions(state, snippetId, path);
  function lineFilter(chunkVersionId: ChunkVersionId, vis: visibility.Visibility | undefined) {
    const isAddedInThisSnippet = isAddedInSnippet(state, chunkVersionId, snippetId);
    return isAddedInThisSnippet || vis === visibility.VISIBLE;
  }
  const { props } = getCodeEditorProps(state, snippetId, path, orderedChunkVersions, lineFilter);
  return props;
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
