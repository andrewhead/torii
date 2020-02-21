import { testUtils } from "torii-store";
import {
  getSelectedChunkVersionDecorations,
  getSnapshotEditorProps,
  getSnippetRangeDecorations
} from "../../selectors/snapshot-editor";

describe("getSnapshotEditorProps", () => {
  it("includes code from past snippets", () => {
    const state = testUtils.createStateWithChunks(
      {
        snippetId: "snippet-0",
        chunkId: "chunk-0",
        line: 1,
        text: ["Line 1A", "Line 2A"].join("\n")
      },
      {
        snippetId: "snippet-0",
        chunkId: "chunk-1",
        line: 3,
        text: ["Line 3", "Line 4"].join("\n")
      },
      {
        snippetId: "snippet-1",
        chunkId: "chunk-0",
        line: 1,
        text: ["Line 1B", "Line 2B"].join("\n")
      }
    );
    const props = getSnapshotEditorProps(
      state,
      "snippet-1",
      testUtils.TEST_FILE_PATH
    );
    expect(props.text).toEqual(
      ["Line 1B", "Line 2B", "Line 3", "Line 4"].join("\n")
    );
  });

  it("gets offsets of snippets", () => {
    const path = "file-path";
    const state = testUtils.createStateWithChunks(
      {
        snippetId: "snippet-0",
        line: 1,
        path,
        chunkVersionId: "chunk-version-0"
      },
      {
        snippetId: "snippet-0",
        line: 3,
        path,
        chunkVersionId: "chunk-version-1"
      },
      {
        snippetId: "snippet-1",
        line: 2,
        path,
        chunkVersionId: "chunk-version-2"
      }
    );
    const props = getSnapshotEditorProps(state, "snippet-1", path);
    expect(props).toMatchObject({
      snippetOffsets: [
        { snippetId: "snippet-0", snippetIndex: 0, line: 1 },
        { snippetId: "snippet-1", snippetIndex: 1, line: 2 },
        { snippetId: "snippet-0", snippetIndex: 0, line: 3 }
      ]
    });
  });
});

describe("getSnippetRangeDecorations", () => {
  const snippetOffsets = [
    { snippetId: "snippet-0", snippetIndex: 0, line: 1 },
    { snippetId: "snippet-1", snippetIndex: 1, line: 3 }
  ];
  const currentSnippet = "snippet-1";
  expect(getSnippetRangeDecorations(snippetOffsets, currentSnippet)).toEqual([
    {
      options: {
        isWholeLine: true,
        className: "snippet-range past-snippet"
      },
      range: {
        startLineNumber: 1,
        startColumn: 0,
        endLineNumber: 2,
        endColumn: Number.POSITIVE_INFINITY
      }
    },
    {
      options: {
        isWholeLine: true,
        className: "snippet-range current-snippet"
      },
      range: {
        startLineNumber: 3,
        startColumn: 0,
        endLineNumber: Number.POSITIVE_INFINITY,
        endColumn: Number.POSITIVE_INFINITY
      }
    }
  ]);
});

describe("getSelectedChunkVersionDecorations", () => {
  it("decorates the body, and boundaries of the chunk", () => {
    const chunkVersionOffsets = [
      { chunkVersionId: "chunk-version-above-id", line: 1 },
      { chunkVersionId: "chunk-version-id", line: 2 },
      { chunkVersionId: "chunk-version-below-id", line: 4 }
    ];
    expect(
      getSelectedChunkVersionDecorations(
        "chunk-version-id",
        chunkVersionOffsets
      )
    ).toEqual([
      {
        options: {
          isWholeLine: true,
          className: "selected-chunk-version-top-boundary"
        },
        range: {
          startLineNumber: 2,
          startColumn: 0,
          endLineNumber: 2,
          endColumn: Number.POSITIVE_INFINITY
        }
      },
      {
        options: {
          isWholeLine: true,
          className: "selected-chunk-version-body"
        },
        range: {
          startLineNumber: 2,
          startColumn: 0,
          endLineNumber: 3,
          endColumn: Number.POSITIVE_INFINITY
        }
      },
      {
        options: {
          isWholeLine: true,
          className: "selected-chunk-version-bottom-boundary"
        },
        range: {
          startLineNumber: 3,
          startColumn: 0,
          endLineNumber: 3,
          endColumn: Number.POSITIVE_INFINITY
        }
      }
    ]);
  });

  it("doesn't make decorations at the editor top and bottom", () => {
    /*
     * This is the only chunk versions. Any decorations created would coincide with the top and
     * the bottom of the editor. Don't bother making decorations for those bounds.
     */
    const chunkVersionOffsets = [
      { chunkVersionId: "chunk-version-id", line: 1 }
    ];
    expect(
      getSelectedChunkVersionDecorations(
        "chunk-version-id",
        chunkVersionOffsets
      )
    ).toEqual([
      {
        options: {
          isWholeLine: true,
          className: "selected-chunk-version-body"
        },
        range: {
          startLineNumber: 1,
          startColumn: 0,
          endLineNumber: Number.POSITIVE_INFINITY,
          endColumn: Number.POSITIVE_INFINITY
        }
      }
    ]);
  });

  it("doesn't make deocrations for an undefined chunk version ID", () => {
    const chunkVersionOffsets = [
      { chunkVersionId: "chunk-version-id", line: 1 }
    ];
    expect(
      getSelectedChunkVersionDecorations(undefined, chunkVersionOffsets)
    ).toEqual([]);
  });
});
