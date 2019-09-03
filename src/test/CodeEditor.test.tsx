import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import MonacoEditor from "react-monaco-editor";
import { SourceType, textUtils, visibility } from "santoku-store";
import { CodeEditor, getSelectionFromSnippetSelection } from "../CodeEditor";

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const text = textUtils.join("Line 1", "Line 2");
  const visibilities = [undefined, visibility.VISIBLE] as (visibility.Visibility | undefined)[];
  const selections = [{ anchor: { line: 1, character: 0 }, active: { line: 1, character: 2 } }];
  const path = "file-path";
  const chunkVersionOffsets = [{ line: 1, chunkVersionId: "chunk-version-0" }];
  /**
   * It doesn't make sense to use anything other than 'shallow' here, because the 'monaco-editor'
   * package is mocked out to just return a div. (Jest can't transpile the ES6 code in the
   * react-monaco-editor that's used to load it, see
   * https://github.com/react-monaco-editor/react-monaco-editor/issues/172).
   */
  const wrapper = shallow(
    <CodeEditor
      {...{ text, visibilities, selections, path, chunkVersionOffsets }}
      edit={jest.fn()}
      setSelections={jest.fn()}
    />
  );
  return {
    wrapper
  };
}

/**
 * We can't test much about the props affect the editor, because the test setup doesn't let us
 * initialize MonacoEditor in the tests. For any important logic that maps from props to
 * editor state and back, make helper functions and test those.
 */
describe("CodeEditor", () => {
  it("should render MonacoEditor", () => {
    const { wrapper } = setup();
    const editorComponent = wrapper.find(MonacoEditor);
    expect(editorComponent.length).toBe(1);
  });
});

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
