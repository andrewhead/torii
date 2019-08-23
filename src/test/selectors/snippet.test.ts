import { SourceType, testUtils, visibility } from "santoku-store";
import { getSnippetText } from "../../../src/selectors/snippet";
import { Reason } from "../../selectors/types";
import { createText } from "../util";

const FILE_PATH = "file-path";

describe("getEditorText", () => {
  it("should have lines from chunk versions, in order", () => {
    const text = testUtils.createSnippetWithChunkVersions(
      { line: 3, text: ["Line 3", "Line 4"].join("\n") },
      { line: 1, text: ["Line 1", "Line 2"].join("\n") }
    );
    const editorText = getSnippetText(text, testUtils.TEST_SNIPPET_ID);
    expect(editorText.byPath[testUtils.TEST_FILE_PATH].text).toEqual(
      ["Line 1", "Line 2", "Line 3", "Line 4"].join("\n")
    );
  });

  it("should have line visiblities", () => {
    const text = createText({
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
    const editorText = getSnippetText(text, "snippet-1");
    expect(editorText.byPath[FILE_PATH]).toMatchObject({
      reasons: [Reason.REQUESTED_VISIBLE],
      text: "Line 1"
    });
  });

  it("should have adjusted selections", () => {
    const text = testUtils.createSnippetWithChunkVersions(
      { id: "chunk-version-0", line: 1, text: ["Line 1", "Line 2"].join("\n") },
      { id: "chunk-version-1", line: 3, text: ["Line 3", "Line 4"].join("\n") }
    );
    text.selections = [
      {
        anchor: { line: 1, character: 0 },
        active: { line: 1, character: 2 },
        path: FILE_PATH,
        relativeTo: { source: SourceType.CHUNK_VERSION, chunkVersionId: "chunk-version-1" }
      }
    ];
    const editorText = getSnippetText(text, testUtils.TEST_SNIPPET_ID);
    expect(editorText.byPath[FILE_PATH]).toMatchObject({
      selections: [
        {
          anchor: { line: 3, character: 0 },
          active: { line: 3, character: 2 }
        }
      ]
    });
  });

  it("should adjust selections from the reference implementation", () => {
    const text = testUtils.createSnippetWithChunkVersions(
      { id: "chunk-version-0", line: 1, text: ["Line 1", "Line 2"].join("\n") },
      { id: "chunk-version-1", line: 3, text: ["Line 3", "Line 4"].join("\n") }
    );
    text.selections = [
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
    const editorText = getSnippetText(text, testUtils.TEST_SNIPPET_ID);
    expect(editorText.byPath[FILE_PATH]).toMatchObject({
      selections: [
        {
          anchor: { line: 3, character: 0 },
          active: { line: 3, character: 2 }
        }
      ]
    });
  });

  it("should have a map from chunk offset to line number", () => {
    const text = testUtils.createSnippetWithChunkVersions(
      { id: "chunk-version-0", line: 1, text: "Line 1" },
      { id: "chunk-version-1", line: 11, text: "Line 11" }
    );
    const editorText = getSnippetText(text, testUtils.TEST_SNIPPET_ID);
    expect(editorText.byPath[FILE_PATH]).toMatchObject({
      chunkVersionOffsets: [
        { chunkVersionId: "chunk-version-0", line: 1 },
        { chunkVersionId: "chunk-version-1", line: 2 }
      ]
    });
  });
});
