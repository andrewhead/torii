import { PartialProgram, SnippetId } from "torii-store";

export interface SnapshotEditorBaseProps extends PartialProgram {
  snippetOffsets: SnippetOffsets;
}

export interface SnippetEditorBaseProps extends PartialProgram {
  lineNumbers: number[];
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
