import { visibility } from "santoku-store";
import { getSnippetText, Reason } from "../../../src/selectors/snippet";
import { createText } from "../util";

describe("getEditorText", () => {
  it("should include lines in chunk versions, in line order", () => {
    const text = createText({
      snippets: {
        all: ["snippet-0"],
        byId: {
          "snippet-0": {
            chunkVersionsAdded: ["chunk-version-0", "chunk-version-1"]
          }
        }
      },
      chunks: {
        all: ["first-chunk", "second-chunk"],
        byId: {
          "first-chunk": {
            location: { line: 1, path: "file-path" }
          },
          "second-chunk": {
            location: { line: 3, path: "file-path" }
          }
        }
      },
      chunkVersions: {
        all: ["chunk-version-0", "chunk-version-1"],
        byId: {
          "chunk-version-0": {
            chunk: "second-chunk",
            text: ["Line 3", "Line 4"].join("\n")
          },
          "chunk-version-1": {
            chunk: "first-chunk",
            text: ["Line 1", "Line 2"].join("\n")
          }
        }
      }
    });
    const editorText = getSnippetText(text, "snippet-0");
    expect(editorText.byPath["file-path"].text).toEqual(
      ["Line 1", "Line 2", "Line 3", "Line 4"].join("\n")
    );
  });

  it("should include lines set to visible", () => {
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
            location: { line: 1, path: "file-path" }
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
    expect(editorText.byPath["file-path"]).toMatchObject({
      reasons: [Reason.REQUESTED_VISIBLE],
      text: "Line 1"
    });
  });
});
