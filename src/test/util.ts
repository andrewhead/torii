import { createStore, testUtils } from "torii-store";

/**
 * Create store with interesting data. This store can be passed to the Redux 'Provider' when
 * testing this app standalone, to make sure the presentation appears correct.
 */
export function createStoreWithFakeData() {
  return createStore(
    testUtils.createStateWithChunks(
      {
        snippetId: "snippet-1",
        chunkId: "chunk-1",
        chunkVersionId: "chunk-1-version-1",
        line: 1,
        text: "Line 1 (Snippet 1, Chunk 1, Version 1)"
      },
      {
        snippetId: "snippet-1",
        chunkId: "chunk-2",
        chunkVersionId: "chunk-2-version-1",
        line: 2,
        text: "Line 2 (Snippet 1, Chunk 2, Version 1)"
      },
      {
        snippetId: "snippet-2",
        chunkId: "chunk-2",
        chunkVersionId: "chunk-2-version-2",
        line: 2,
        text: "Line 2 v2 (Snippet 1, Chunk 2, Version 2)"
      },
      {
        snippetId: "snippet-2",
        chunkId: "chunk-3",
        chunkVersionId: "chunk-3-version-1",
        line: 3,
        text:
          "Line 3 (Snippet 2, Chunk 1, Version 1)\nLine 4 (Snippet 2, Chunk 1, Version 1)"
      }
    )
  );
}
