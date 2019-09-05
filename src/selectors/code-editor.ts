import {
  ChunkVersionId,
  Path,
  Selection,
  SnippetId,
  SourceType,
  State,
  textUtils,
  Undoable,
  visibility
} from "santoku-store";
import {
  ChunkVersionIdToSnippetIdMap,
  ChunkVersionOffsets,
  CodeEditorBaseProps,
  LineFilter,
  LineText,
  SnippetSelection
} from "./types";

/**
 * Not intended to be called by components. Use instead 'getSnippetEditorProps' or
 * 'getSnapshotEditorProps'. Returns both the editor props, as well as a list of annotated text
 * for each line that will be shown in the editor, so that callers can do additional processing.
 */
export function getCodeEditorBaseProps(
  state: State,
  snippetId: SnippetId,
  path: Path,
  sortedChunkVersions: ChunkVersionId[],
  filter?: LineFilter
) {
  const stateSlice = state.undoable.present;
  const lineTexts: LineText[] = [];
  const chunkVersionSnippets = getChunkVersionIdToSnippetIdMap(state);
  let lineIndex = 1;

  for (const chunkVersionId of sortedChunkVersions) {
    const chunkVersion = stateSlice.chunkVersions.byId[chunkVersionId];
    const { chunk: chunkId, text: chunkVersionText } = chunkVersion;
    const lines = textUtils.split(chunkVersionText);

    for (let chunkLineIndex = 0; chunkLineIndex < lines.length; chunkLineIndex++) {
      const lineVisibility = getVisibility(stateSlice, snippetId, chunkVersionId, chunkLineIndex);
      if (filter === undefined || filter(chunkVersionId, chunkLineIndex)) {
        lineTexts.push({
          snippetId: chunkVersionSnippets[chunkVersionId],
          chunkId,
          chunkVersionId,
          offset: lineIndex,
          visibility: lineVisibility,
          text: lines[chunkLineIndex]
        });
      }
      lineIndex += 1;
    }
  }
  const visibilities = lineTexts.map(lt => lt.visibility);
  const text = textUtils.join(...lineTexts.map(lt => lt.text));
  const selections = getSnippetSelections(stateSlice, sortedChunkVersions);
  const chunkVersionOffsets = getChunkVersionOffsets(lineTexts);
  const selectedChunkVersionId = getSelectedChunkVersionId(stateSlice.selections, lineTexts);
  const props: CodeEditorBaseProps = {
    path,
    visibilities,
    text,
    selections,
    chunkVersionOffsets,
    selectedChunkVersionId
  };
  return { props, lineTexts };
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

function getChunkVersionOffsets(lineTexts: LineText[]): ChunkVersionOffsets {
  const offsets = [];
  let lastChunkVersionId;
  for (let i = 0; i < lineTexts.length; i++) {
    const { chunkVersionId } = lineTexts[i];
    if (chunkVersionId !== lastChunkVersionId) {
      offsets.push({ line: i + 1, chunkVersionId });
    }
    lastChunkVersionId = chunkVersionId;
  }
  return offsets;
}

/**
 * Returns map from all chunk version IDs in the state to the snippets they belong to.
 */
function getChunkVersionIdToSnippetIdMap(state: State) {
  const snippets = state.undoable.present.snippets;
  const lookup: ChunkVersionIdToSnippetIdMap = {};
  for (const snippetId of snippets.all) {
    const snippet = snippets.byId[snippetId];
    for (const chunkVersionId of snippet.chunkVersionsAdded) {
      lookup[chunkVersionId] = snippetId;
    }
  }
  return lookup;
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
 * Get the ID of the chunk version selected in a code editor. See the definition of the
 * 'selectedChunkVersionId' prop to understand when this property will be 'undefined'.
 */
function getSelectedChunkVersionId(
  selections: Selection[],
  lineTexts: LineText[]
): ChunkVersionId | undefined {
  let selectedChunkVersionId: ChunkVersionId | undefined;
  for (const selection of selections) {
    if (selection.relativeTo.source === SourceType.REFERENCE_IMPLEMENTATION) {
      return undefined;
    } else if (selection.relativeTo.source === SourceType.CHUNK_VERSION) {
      if (selectedChunkVersionId === undefined) {
        selectedChunkVersionId = selection.relativeTo.chunkVersionId;
      } else if (selectedChunkVersionId !== selection.relativeTo.chunkVersionId) {
        return undefined;
      }
    }
  }
  if (lineTexts.some(lt => lt.chunkVersionId === selectedChunkVersionId)) {
    return selectedChunkVersionId;
  }
  return undefined;
}
