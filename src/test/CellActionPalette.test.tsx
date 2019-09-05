import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { Cell, ContentType } from "santoku-store";
import { CellActionPalette } from "../CellActionPalette";
import OutputPalette from "../OutputPalette";

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const cellId = "snippet-id";
  const cell = { type: ContentType.SNIPPET, contentId: "snippet-id" } as Cell;
  const cellIndex = 0;
  const deleteCell = jest.fn();
  const props = { cellId, cell, cellIndex, deleteCell };
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
