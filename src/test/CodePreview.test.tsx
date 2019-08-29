import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { SourceType } from "santoku-store";
import { getSelectionFromSnippetSelection } from "../CodePreview";

Enzyme.configure({ adapter: new Adapter() });

describe("getSelectionFromSnippetSelection", () => {
  it("should get a selection", () => {
    const snippetSelection = {
      anchor: { line: 3, character: 0 },
      active: { line: 3, character: 2 }
    };
    const path = "file-path";
    const chunkVersionOffsets = [
      { line: 1, chunkVersionId: "chunk-version-0" },
      { line: 3, chunkVersionId: "chunk-version-1" }
    ];
    expect(getSelectionFromSnippetSelection(snippetSelection, path, chunkVersionOffsets)).toEqual({
      anchor: { line: 1, character: 0 },
      active: { line: 1, character: 2 },
      path,
      relativeTo: { source: SourceType.CHUNK_VERSION, chunkVersionId: "chunk-version-1" }
    });
  });
});
