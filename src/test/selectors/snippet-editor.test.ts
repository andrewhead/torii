import { testUtils, visibility } from "santoku-store";
import { getSnippetEditorProps } from "../../selectors/snippet-editor";

const FILE_PATH = "file-path";

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
});
