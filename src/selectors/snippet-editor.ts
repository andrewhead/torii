import { ChunkVersionId, Path, selectors, SnippetId, State, visibility } from "santoku-store";
import { getCodeEditorBaseProps } from "./code-editor";
import { isAddedInSnippet } from "./snippet";
import { SnippetEditorBaseProps } from "./types";

export function getSnippetEditorProps(
  state: State,
  snippetId: SnippetId,
  path: Path
): SnippetEditorBaseProps {
  const chunkVersions = selectors.code.getSnapshotOrderedChunkVersions(state, snippetId, path);
  const visibilityRules = state.undoable.present.visibilityRules;
  function lineFilter(chunkVersionId: ChunkVersionId, offset: number) {
    const isAddedInThisSnippet = isAddedInSnippet(state, chunkVersionId, snippetId);
    const isLineSetToVisible =
      visibilityRules[snippetId] !== undefined &&
      visibilityRules[snippetId][chunkVersionId] !== undefined &&
      visibilityRules[snippetId][chunkVersionId][offset] === visibility.VISIBLE;
    return isAddedInThisSnippet || isLineSetToVisible;
  }
  const { props, lineTexts } = getCodeEditorBaseProps(
    state,
    snippetId,
    path,
    chunkVersions,
    lineFilter
  );
  return {
    ...props,
    lineNumbers: lineTexts.map(l => l.offset)
  };
}
