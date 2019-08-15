import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { CodePreview } from "../CodePreview";
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
  it("should render CodePreview", () => {
    const { wrapper } = setup();
    const codePreviews = wrapper.find(CodePreview);
    expect(codePreviews.length).toBe(1);
  });
});
