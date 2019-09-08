import { SourceType, testUtils } from "santoku-store";
import { getPartialProgram } from "../../selectors/code-editor";

describe("getPartialProgram", () => {
  it("should have adjusted selections", () => {
    const code = testUtils.createChunks(
      { chunkVersionId: "chunk-version-0", line: 1, text: ["Line 1", "Line 2"].join("\n") },
      { chunkVersionId: "chunk-version-1", line: 3, text: ["Line 3", "Line 4"].join("\n") }
    );
    code.selections = [
      {
        anchor: { line: 1, character: 0 },
        active: { line: 1, character: 2 },
        path: testUtils.TEST_FILE_PATH,
        relativeTo: { source: SourceType.CHUNK_VERSION, chunkVersionId: "chunk-version-1" }
      }
    ];
    const state = testUtils.createStateWithUndoable(code);
    const chunkVersions = ["chunk-version-0", "chunk-version-1"];
    const { partialProgram } = getPartialProgram(
      state,
      testUtils.TEST_SNIPPET_ID,
      testUtils.TEST_FILE_PATH,
      chunkVersions
    );
    expect(partialProgram).toMatchObject({
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
        path: testUtils.TEST_FILE_PATH,
        relativeTo: { source: SourceType.REFERENCE_IMPLEMENTATION }
      },
      /*
       * Should not appear in snippet, out of bounds.
       */
      {
        anchor: { line: 5, character: 0 },
        active: { line: 5, character: 2 },
        path: testUtils.TEST_FILE_PATH,
        relativeTo: { source: SourceType.REFERENCE_IMPLEMENTATION }
      }
    ];
    const state = testUtils.createStateWithUndoable(code);
    const chunkVersions = ["chunk-version-0", "chunk-version-1"];
    const { partialProgram } = getPartialProgram(
      state,
      testUtils.TEST_SNIPPET_ID,
      testUtils.TEST_FILE_PATH,
      chunkVersions
    );
    expect(partialProgram).toMatchObject({
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
      { chunkVersionId: "chunk-version-0", line: 1 },
      { chunkVersionId: "chunk-version-1", line: 11 }
    );
    const chunkVersions = ["chunk-version-0", "chunk-version-1"];
    const { partialProgram } = getPartialProgram(
      state,
      testUtils.TEST_SNIPPET_ID,
      testUtils.TEST_FILE_PATH,
      chunkVersions
    );
    expect(partialProgram).toMatchObject({
      chunkVersionOffsets: [
        { chunkVersionId: "chunk-version-0", line: 1 },
        { chunkVersionId: "chunk-version-1", line: 2 }
      ]
    });
  });

  describe("selected chunk version", () => {
    it("should have a selected chunk version", () => {
      const state = testUtils.createStateWithChunks({ chunkVersionId: "chunk-version-0", line: 1 });
      state.undoable.present.selections = [
        {
          anchor: { line: 1, character: 0 },
          active: { line: 1, character: 2 },
          path: testUtils.TEST_FILE_PATH,
          relativeTo: { source: SourceType.CHUNK_VERSION, chunkVersionId: "chunk-version-0" }
        },
        {
          anchor: { line: 1, character: 2 },
          active: { line: 1, character: 4 },
          path: testUtils.TEST_FILE_PATH,
          relativeTo: { source: SourceType.CHUNK_VERSION, chunkVersionId: "chunk-version-0" }
        }
      ];
      const chunkVersions = ["chunk-version-0"];
      const { partialProgram } = getPartialProgram(
        state,
        testUtils.TEST_SNIPPET_ID,
        testUtils.TEST_FILE_PATH,
        chunkVersions
      );
      expect(partialProgram.selectedChunkVersionId).toBe("chunk-version-0");
    });

    it("should be undefined without selections", () => {
      const state = testUtils.createStateWithChunks({ chunkVersionId: "chunk-version-0", line: 1 });
      const chunkVersions = ["chunk-version-0"];
      const { partialProgram } = getPartialProgram(
        state,
        testUtils.TEST_SNIPPET_ID,
        testUtils.TEST_FILE_PATH,
        chunkVersions
      );
      expect(partialProgram.selectedChunkVersionId).toBeUndefined();
    });

    it("should be undefined if there are selections in multiple chunk versions", () => {
      const state = testUtils.createStateWithChunks(
        { chunkVersionId: "chunk-version-0", line: 1 },
        { chunkVersionId: "chunk-version-1", line: 2 }
      );
      const chunkVersions = ["chunk-version-0", "chunk-version-1"];
      state.undoable.present.selections = [
        {
          anchor: { line: 1, character: 0 },
          active: { line: 1, character: 2 },
          path: testUtils.TEST_FILE_PATH,
          relativeTo: { source: SourceType.CHUNK_VERSION, chunkVersionId: "chunk-version-0" }
        },
        /*
         * The two selections are in two distinct chunks.
         */
        {
          anchor: { line: 1, character: 2 },
          active: { line: 1, character: 4 },
          path: testUtils.TEST_FILE_PATH,
          relativeTo: { source: SourceType.CHUNK_VERSION, chunkVersionId: "chunk-version-1" }
        }
      ];
      const { partialProgram } = getPartialProgram(
        state,
        testUtils.TEST_SNIPPET_ID,
        testUtils.TEST_FILE_PATH,
        chunkVersions
      );
      expect(partialProgram.selectedChunkVersionId).toBeUndefined();
    });

    it("should be undefined if the chunk version isn't in the editor", () => {
      const state = testUtils.createStateWithChunks(
        { chunkVersionId: "chunk-version-0", line: 1 },
        { chunkVersionId: "chunk-version-1", line: 2 }
      );
      const chunkVersions = ["chunk-version-0", "chunk-version-1"];
      state.undoable.present.selections = [
        {
          anchor: { line: 1, character: 0 },
          active: { line: 1, character: 2 },
          path: testUtils.TEST_FILE_PATH,
          relativeTo: { source: SourceType.CHUNK_VERSION, chunkVersionId: "chunk-version-0" }
        }
      ];
      const { partialProgram } = getPartialProgram(
        state,
        testUtils.TEST_SNIPPET_ID,
        testUtils.TEST_FILE_PATH,
        chunkVersions,
        /*
         * chunk-version-0 will be omitted from the code, so it should not be the selected chunk
         * version ID for this editor.
         */
        function filter(chunkVersionId) {
          return chunkVersionId === "chunk-version-1";
        }
      );
      expect(partialProgram.selectedChunkVersionId).toBeUndefined();
    });
  });
});
