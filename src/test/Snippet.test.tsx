import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import OutputPalette from "../OutputPalette";
import { Snippet } from "../Snippet";
import SnippetEditor from "../SnippetEditor";

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const id = "snippet-id";
  const paths = ["path"];
  const props = { id, paths };
  const wrapper = shallow(<Snippet {...props} cellIndex={0} />);
  return {
    wrapper
  };
}

describe("Snippet", () => {
  it("should render CodeEditor", () => {
    const { wrapper } = setup();
    const codeEditor = wrapper.find(SnippetEditor);
    expect(codeEditor.length).toBe(1);
  });

  it("should render an OutputPalette", () => {
    const { wrapper } = setup();
    const outputPalette = wrapper.find(OutputPalette);
    expect(outputPalette.length).toBe(1);
  });
});
