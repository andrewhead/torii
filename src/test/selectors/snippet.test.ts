import { SourceType, testUtils, visibility } from "santoku-store";
import { getSnippetEditorProps, getSnippetPaths } from "../../../src/selectors/snippet";
import { Reason } from "../../selectors/types";

const FILE_PATH = "file-path";

describe("getSnippetPaths", () => {
  it("gets the paths of chunks in the snippet", () => {
    const snippetId = "snippet-0";
    const code = testUtils.createChunks(
      { snippetId, path: "path-0" },
      { snippetId, path: "path-1" }
    );
    const paths = getSnippetPaths(code, snippetId);
    expect(paths).toContain("path-0");
    expect(paths).toContain("path-1");
  });
});

describe("getSnippetText", () => {
  it("should have lines from chunk versions, in order", () => {
    const code = testUtils.createChunks(
      { line: 3, text: ["Line 3", "Line 4"].join("\n") },
      { line: 1, text: ["Line 1", "Line 2"].join("\n") }
    );
    const props = getSnippetEditorProps(code, testUtils.TEST_SNIPPET_ID, testUtils.TEST_FILE_PATH);
    expect(props.text).toEqual(["Line 1", "Line 2", "Line 3", "Line 4"].join("\n"));
  });

  it("should have line visiblities", () => {
    const code = testUtils.createUndoable({
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
    const props = getSnippetEditorProps(code, "snippet-1", FILE_PATH);
    expect(props).toMatchObject({
      reasons: [Reason.REQUESTED_VISIBLE],
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
    const props = getSnippetEditorProps(code, testUtils.TEST_SNIPPET_ID, FILE_PATH);
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
    const props = getSnippetEditorProps(code, testUtils.TEST_SNIPPET_ID, FILE_PATH);
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
    const code = testUtils.createChunks(
      { chunkVersionId: "chunk-version-0", line: 1, text: "Line 1" },
      { chunkVersionId: "chunk-version-1", line: 11, text: "Line 11" }
    );
    const props = getSnippetEditorProps(code, testUtils.TEST_SNIPPET_ID, FILE_PATH);
    expect(props).toMatchObject({
      chunkVersionOffsets: [
        { chunkVersionId: "chunk-version-0", line: 1 },
        { chunkVersionId: "chunk-version-1", line: 2 }
      ]
    });
  });
});
