import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import CodePreview from "../CodePreview";
import OutputPalette from "../OutputPalette";
import { Reason, SnippetText } from "../selectors/types";
import { Snippet } from "../Snippet";

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const id = "snippet-id";
  const snippetText: SnippetText = {
    byPath: {
      path: {
        reasons: [Reason.ADDED],
        text: "Text",
        selections: [],
        chunkVersionOffsets: [{ line: 1, chunkVersionId: "chunk-version-0" }]
      }
    },
    paths: ["path"]
  };
  const props = { id, snippetText };
  const wrapper = shallow(<Snippet {...props} cellIndex={0} />);
  return {
    wrapper
  };
}

describe("Snippet", () => {
  it("should render CodePreview", () => {
    const { wrapper } = setup();
    const codePreview = wrapper.find(CodePreview);
    expect(codePreview.length).toBe(1);
  });

  it("should render an OutputPalette", () => {
    const { wrapper } = setup();
    const outputPalette = wrapper.find(OutputPalette);
    expect(outputPalette.length).toBe(1);
  });
});
