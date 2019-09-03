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

  it("should have line numbers relative to the current program snapshot", () => {
    const state = testUtils.createStateWithChunks(
      { snippetId: "snippet-0", text: "Line 1", path: FILE_PATH, line: 1 },
      { snippetId: "snippet-1", text: "Line 3", path: FILE_PATH, line: 3 },
      /*
       * Snippet 2 will be omitted because it's in sequence after snippet 1. Snippet 1's line in
       * the snapshot will appear on line 2, after Snippet 0's line.
       */
      { snippetId: "snippet-2", text: "Line 2", path: FILE_PATH, line: 2 }
    );
    const props = getSnippetEditorProps(state, "snippet-1", FILE_PATH);
    expect(props.lineNumbers).toEqual([2]);
  });

  it("should have line visiblities", () => {
    const state = testUtils.createStateWithChunks(
      {
        snippetId: "snippet-0",
        chunkVersionId: "chunk-version-0",
        line: 1,
        path: FILE_PATH,
        text: "Line 1\nLine 2"
      },
      { snippetId: "snippet-1", line: 3, text: "Line 3" }
    );
    /**
     * The first line of the chunk from the first snippet should be visible in the second snippet.
     */
    state.undoable.present.visibilityRules = {
      "snippet-1": {
        "chunk-version-0": {
          1: visibility.VISIBLE
        }
      }
    };
    const props = getSnippetEditorProps(state, "snippet-1", FILE_PATH);
    expect(props).toMatchObject({
      visibilities: [visibility.VISIBLE, undefined],
      text: "Line 2\nLine 3"
    });
  });
});
