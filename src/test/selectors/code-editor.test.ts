import { SourceType, testUtils } from "santoku-store";
import { getCodeEditorProps } from "../../selectors/code-editor";

const FILE_PATH = "file-path";

describe("getCodeEditorProps", () => {
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
    const chunkVersions = ["chunk-version-0", "chunk-version-1"];
    const props = getCodeEditorProps(state, testUtils.TEST_SNIPPET_ID, FILE_PATH, chunkVersions)
      .props;
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
    const chunkVersions = ["chunk-version-0", "chunk-version-1"];
    const props = getCodeEditorProps(state, testUtils.TEST_SNIPPET_ID, FILE_PATH, chunkVersions)
      .props;
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
    const chunkVersions = ["chunk-version-0", "chunk-version-1"];
    const props = getCodeEditorProps(state, testUtils.TEST_SNIPPET_ID, FILE_PATH, chunkVersions)
      .props;
    expect(props).toMatchObject({
      chunkVersionOffsets: [
        { chunkVersionId: "chunk-version-0", line: 1 },
        { chunkVersionId: "chunk-version-1", line: 2 }
      ]
    });
  });
});
