import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import AceEditor from "react-ace";
import { textUtils } from "santoku-store";
import { CodePreview } from "../CodePreview";
import { Reason } from "../selectors/snippet";

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const text = textUtils.join("Line 1", "Line 2");
  const reasons = [Reason.ADDED, Reason.REQUESTED_VISIBLE];
  const wrapper = mount(<CodePreview {...{ text, reasons }} />);
  return {
    wrapper
  };
}

describe("Snippet", () => {
  it("should render AceEditor with highlights", () => {
    const { wrapper } = setup();
    const aceEditor = wrapper.find(AceEditor);
    expect(aceEditor.length).toBe(1);
    expect(aceEditor.prop("value")).toEqual("Line 1\nLine 2");
    expect(aceEditor.prop("markers")).toMatchObject([
      { startRow: 2, type: "background", className: "requested-visible" }
    ]);
  });
});
