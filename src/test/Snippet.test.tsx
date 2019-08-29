import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { Reason, SnippetText } from "../selectors/types";
import { Snippet } from "../Snippet";
import { connected, styled } from "./util";

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
  const wrapper = shallow(<Snippet {...props} />);
  return {
    wrapper
  };
}

describe("Snippet", () => {
  it("should render CodePreview", () => {
    const { wrapper } = setup();
    const codePreview = wrapper.find(styled("CodePreview"));
    expect(codePreview.length).toBe(1);
  });

  it("should render an OutputPalette", () => {
    const { wrapper } = setup();
    const outputPalette = wrapper.find(connected(styled("OutputPalette")));
    expect(outputPalette.length).toBe(1);
  });
});
