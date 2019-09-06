import { testUtils } from "santoku-store";
import { canInstantMerge, isLinked } from "../../selectors/link";

describe("isLinked", () => {
  it("detects a linked chunk", () => {
    const state = testUtils.createStateWithChunks(
      { chunkVersionId: "chunk-version-id" },
      { chunkVersionId: "unrelated-chunk-version-id", snippetId: "snippet-id" }
    );
    /*
     * Any appearance of 'chunk-version-id' in 'snippet-id' will be linked to an
     * earlier appearance of 'chunk-version-id', as the chunk wasn't changed in the snippet.
     */
    expect(isLinked(state, "chunk-version-id", "snippet-id")).toBe(true);
  });

  it("detects the first chunk appearance as 'linked'", () => {
    const state = testUtils.createStateWithChunks({
      chunkVersionId: "chunk-version-id",
      snippetId: "snippet-id"
    });
    expect(isLinked(state, "chunk-version-id", "snippet-id")).toBe(true);
  });

  it("detects an unlinked chunk", () => {
    const state = testUtils.createStateWithChunks(
      { chunkId: "same-chunk-id", chunkVersionId: "chunk-version-0" },
      { chunkId: "same-chunk-id", chunkVersionId: "chunk-version-1", snippetId: "snippet-id" }
    );
    expect(isLinked(state, "chunk-version-1", "snippet-id")).toBe(false);
  });
});

describe("canInstantMerge", () => {
  it("merges when there are no changes between versions in snippets", () => {
    const state = testUtils.createStateWithChunks(
      {
        chunkId: "same-chunk-id",
        chunkVersionId: "previous-chunk-version-id",
        text: "Exact same text"
      },
      {
        chunkId: "same-chunk-id",
        chunkVersionId: "chunk-version-id",
        snippetId: "snippet-id",
        text: "Exact same text"
      }
    );
    expect(canInstantMerge(state, "chunk-version-id", "snippet-id")).toBe(true);
  });

  it("merges when there are no changes between version and reference implementation", () => {
    const state = testUtils.createStateWithChunks(
      {
        /*
         * The first chunk version belongs to the reference implementation but isn't in a snippet.
         */
        snippetId: null,
        chunkId: "same-chunk-id",
        chunkVersionId: "previous-chunk-version-id",
        text: "Exact same text"
      },
      {
        chunkId: "same-chunk-id",
        chunkVersionId: "chunk-version-id",
        snippetId: "snippet-id",
        text: "Exact same text"
      }
    );
    expect(canInstantMerge(state, "chunk-version-id", "snippet-id")).toBe(true);
  });

  it("doesn't merge when there was a change", () => {
    const state = testUtils.createStateWithChunks(
      {
        chunkId: "same-chunk-id",
        chunkVersionId: "previous-chunk-version-id",
        text: "Different text 1"
      },
      {
        chunkId: "same-chunk-id",
        chunkVersionId: "chunk-version-id",
        snippetId: "snippet-id",
        text: "Different text 2"
      }
    );
    expect(canInstantMerge(state, "chunk-version-id", "snippet-id")).toBe(false);
  });

  it("is false if the chunk versions are already linked", () => {
    const state = testUtils.createStateWithChunks(
      { chunkVersionId: "chunk-version-id", text: "Exact same text" },
      {
        chunkVersionId: "unrelated-chunk-version-id",
        snippetId: "snippet-id",
        text: "Exact same text"
      }
    );
    /*
     * Can't instant merge because there's nothing to merge!
     */
    expect(canInstantMerge(state, "chunk-version-id", "snippet-id")).toBe(false);
  });
});
