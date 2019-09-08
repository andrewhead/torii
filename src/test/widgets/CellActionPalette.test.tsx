import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { ContentType } from "santoku-store";
import { CellActionPalette } from "../../widgets/CellActionPalette";
import OutputPalette from "../../widgets/OutputPalette";

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const cellId = "snippet-id";
  const contentType = ContentType.SNIPPET;
  const contentId = "snippet-id";
  const cellIndex = 0;
  const deleteCell = jest.fn();
  const hide = jest.fn();
  const props = { cellId, contentType, contentId, cellIndex, deleteCell, hide };
  const wrapper = shallow(<CellActionPalette {...props} />);
  return {
    wrapper
  };
}

describe("Snippet", () => {
  it("should render CodeEditor", () => {
    const { wrapper } = setup();
    const codeEditor = wrapper.find(OutputPalette);
    expect(codeEditor.length).toBe(1);
  });
});
