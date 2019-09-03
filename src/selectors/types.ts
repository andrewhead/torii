import { ChunkId, ChunkVersionId, Path, Position, SnippetId, visibility } from "santoku-store";

export interface BaseSnapshotEditorProps extends BaseCodeEditorProps {
  snippetOffsets: SnippetOffsets;
}

export interface BaseCodeEditorProps {
  text: string;
  visibilities: (visibility.Visibility | undefined)[];
  selections: SnippetSelection[];
  chunkVersionOffsets: ChunkVersionOffsets;
  path: Path;
}

export type LineFilter = (
  chunkVersionId: ChunkVersionId,
  visibility: visibility.Visibility | undefined
) => boolean;

export interface LineText {
  text: string;
  snippetId: SnippetId;
  chunkId: ChunkId;
  chunkVersionId: ChunkVersionId;
  /**
   * Offset of line within chunk version text. Starts at 0.
   */
  offset: number;
  visibility: visibility.Visibility | undefined;
}

export interface ChunkVersionsByPath {
  [path: string]: ChunkVersionId[];
}

export interface ChunkVersionIdToSnippetIdMap {
  [chunkVersionId: string]: SnippetId;
}

/**
 * Compared to 'Selection' in santoku-store, these selections are used solely as pointers to
 * regions where selections should be made in a snippet editor. They are created for a specific
 * snippet, so they don't need any information about the paths or chunks they're from.
 */
export interface SnippetSelection {
  anchor: Position;
  active: Position;
}
export type ChunkVersionOffsets = ChunkVersionOffset[];

interface ChunkVersionOffset {
  /**
   * Line index, offset of where a chunk version appears in a snippet. First line is 1.
   */
  line: number;
  chunkVersionId: ChunkVersionId;
}

export type SnippetOffsets = SnippetOffset[];

interface SnippetOffset {
  snippetId: SnippetId;
  /**
   * Line index, offset of where code from a snippet is placed in the editor. First line is 1.
   */
  line: number;
  /**
   * Snippet that this and subsequent lines (until the next offset) came from. First snippet is 1.
   */
  snippetIndex: number;
}
