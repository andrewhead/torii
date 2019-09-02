import { ChunkId, ChunkVersionId, Path, Position, visibility } from "santoku-store";

export interface SnippetText {
  paths: Path[];
  byPath: {
    [path: string]: CodeEditorProps;
  };
}

export interface CodeEditorProps {
  text: string;
  visibilities: (visibility.Visibility | undefined)[];
  selections: SnippetSelection[];
  chunkVersionOffsets: ChunkVersionOffsets;
  path: Path;
}

export interface LineText {
  text: string;
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

/**
 * Compared to 'Selection' in santoku-store, these selections are used solely as pointers to
 * regions where selections should be made in a snippet editor. They are created for a specific
 * snippet, so they don't need any information about the paths or chunks they're from.
 */
export interface SnippetSelection {
  anchor: Position;
  active: Position;
}

export enum Reason {
  ADDED,
  REQUESTED_VISIBLE
}

export type ChunkVersionOffsets = ChunkVersionOffset[];

interface ChunkVersionOffset {
  /**
   * Line index, offset of where a chunk version appears in a snippet. First line is 1.
   */
  line: number;
  chunkVersionId: ChunkVersionId;
}
