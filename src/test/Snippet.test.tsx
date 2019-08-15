import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import AceEditor from "react-ace";
import { Reason, SnippetText } from "../selectors/snippet";
import { Snippet } from "../Snippet";

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const snippetText: SnippetText = {
    byPath: {
      path: {
        reasons: [Reason.ADDED],
        text: "Text"
      }
    },
    paths: ["path"]
  };
  const props = { snippetText };
  const wrapper = shallow(<Snippet {...props} />);
  return {
    wrapper
  };
}

describe("Snippet", () => {
  it("should render AceEditor with text", () => {
    const { wrapper } = setup();
    const aceEditor = wrapper.find(AceEditor);
    expect(aceEditor.length).toBe(1);
    expect(aceEditor.prop("value")).toEqual("Text");
  });
});
