import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import MonacoEditor from "react-monaco-editor";
import { textUtils } from "santoku-store";
import { CodePreview } from "../CodePreview";
import { Reason } from "../selectors/snippet";

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const text = textUtils.join("Line 1", "Line 2");
  const reasons = [Reason.ADDED, Reason.REQUESTED_VISIBLE];
  /**
   * It doesn't make sense to use anything other than 'shallow' here, because the 'monaco-editor'
   * package is mocked out to just return a div. (Jest can't transpile the ES6 code in the
   * react-monaco-editor that's used to load it, see
   * https://github.com/react-monaco-editor/react-monaco-editor/issues/172).
   */
  const wrapper = shallow(<CodePreview {...{ text, reasons }} />);
  return {
    wrapper
  };
}

describe("Snippet", () => {
  it("should render MonacoEditor with highlights", () => {
    const { wrapper } = setup();
    const editorComponent = wrapper.find(MonacoEditor);
    expect(editorComponent.length).toBe(1);
    expect(editorComponent.prop("value")).toEqual("Line 1\nLine 2");
    // TODO(andrewhead): re-enable the tests for Moncao Editor
    // expect(editorComponent.prop("markers")).toMatchObject([
    // { startRow: 2, type: "background", className: "requested-visible" }
    // ]);
  });
});
