import { SourceType, testUtils, visibility } from "santoku-store";
import { getSnapshotEditorProps, getSnippetEditorProps } from "../../selectors/code-editor";

const FILE_PATH = "file-path";

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
    const props = getSnapshotEditorProps(state, "snippet-1", testUtils.TEST_FILE_PATH);
    expect(props.text).toEqual(["Line 1B", "Line 2B", "Line 3", "Line 4"].join("\n"));
  });
});

describe("getSnippetEditorProps", () => {
  it("should have lines from chunk versions, in order", () => {
    const state = testUtils.createStateWithChunks(
      { line: 3, text: ["Line 3", "Line 4"].join("\n") },
      { line: 1, text: ["Line 1", "Line 2"].join("\n") }
    );
    const props = getSnippetEditorProps(state, testUtils.TEST_SNIPPET_ID, testUtils.TEST_FILE_PATH);
    expect(props.text).toEqual(["Line 1", "Line 2", "Line 3", "Line 4"].join("\n"));
  });

  it("should have line visiblities", () => {
    const state = testUtils.createStateWithUndoable({
      snippets: {
        all: ["snippet-0", "snippet-1"],
        byId: {
          "snippet-0": {
            chunkVersionsAdded: ["chunk-version-0"]
          },
          "snippet-1": {
            chunkVersionsAdded: []
          }
        }
      },
      chunks: {
        all: ["chunk-0"],
        byId: {
          "chunk-0": {
            location: { line: 1, path: FILE_PATH },
            versions: []
          }
        }
      },
      chunkVersions: {
        all: ["chunk-version-0"],
        byId: {
          "chunk-version-0": {
            chunk: "chunk-0",
            text: ["Line 1", "Line 2"].join("\n")
          }
        }
      },
      selections: [],
      /**
       * The first line of the chunk from the first snippet should be visible in the second snippet.
       */
      visibilityRules: {
        "snippet-1": {
          "chunk-version-0": {
            0: visibility.VISIBLE
          }
        }
      }
    });
    const props = getSnippetEditorProps(state, "snippet-1", FILE_PATH);
    expect(props).toMatchObject({
      visibilities: [visibility.VISIBLE],
      text: "Line 1"
    });
  });

  it("should have adjusted selections", () => {
    const code = testUtils.createChunks(
      { chunkVersionId: "chunk-version-0", line: 1, text: ["Line 1", "Line 2"].join("\n") },
      { chunkVersionId: "chunk-version-1", line: 3, text: ["Line 3", "Line 4"].join("\n") }
    );
    code.selections = [
      {
        anchor: { line: 1, character: 0 },
        active: { line: 1, character: 2 },
        path: FILE_PATH,
        relativeTo: { source: SourceType.CHUNK_VERSION, chunkVersionId: "chunk-version-1" }
      }
    ];
    const state = testUtils.createStateWithUndoable(code);
    const props = getSnippetEditorProps(state, testUtils.TEST_SNIPPET_ID, FILE_PATH);
    expect(props).toMatchObject({
      selections: [
        {
          anchor: { line: 3, character: 0 },
          active: { line: 3, character: 2 }
        }
      ]
    });
  });

  it("should adjust selections from the reference implementation", () => {
    const code = testUtils.createChunks(
      { chunkVersionId: "chunk-version-0", line: 1, text: ["Line 1", "Line 2"].join("\n") },
      { chunkVersionId: "chunk-version-1", line: 3, text: ["Line 3", "Line 4"].join("\n") }
    );
    code.selections = [
      /*
       * Should appear in snippet.
       */
      {
        anchor: { line: 3, character: 0 },
        active: { line: 3, character: 2 },
        path: FILE_PATH,
        relativeTo: { source: SourceType.REFERENCE_IMPLEMENTATION }
      },
      /*
       * Should not appear in snippet, out of bounds.
       */
      {
        anchor: { line: 5, character: 0 },
        active: { line: 5, character: 2 },
        path: FILE_PATH,
        relativeTo: { source: SourceType.REFERENCE_IMPLEMENTATION }
      }
    ];
    const state = testUtils.createStateWithUndoable(code);
    const props = getSnippetEditorProps(state, testUtils.TEST_SNIPPET_ID, FILE_PATH);
    expect(props).toMatchObject({
      selections: [
        {
          anchor: { line: 3, character: 0 },
          active: { line: 3, character: 2 }
        }
      ]
    });
  });

  it("should have a map from chunk offset to line number", () => {
    const state = testUtils.createStateWithChunks(
      { chunkVersionId: "chunk-version-0", line: 1, text: "Line 1" },
      { chunkVersionId: "chunk-version-1", line: 11, text: "Line 11" }
    );
    const props = getSnippetEditorProps(state, testUtils.TEST_SNIPPET_ID, FILE_PATH);
    expect(props).toMatchObject({
      chunkVersionOffsets: [
        { chunkVersionId: "chunk-version-0", line: 1 },
        { chunkVersionId: "chunk-version-1", line: 2 }
      ]
    });
  });
});
