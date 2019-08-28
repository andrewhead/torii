import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { ContentType, OutputId } from "santoku-store";
import { Cell } from "../Cell";
import { connected } from "./util";

Enzyme.configure({ adapter: new Adapter() });

function setup(contentType?: ContentType, contentId?: any) {
  // To test test drag-and-drop behavior of cells, you will need to test DraggableCell.
  // You may need to provide a drag-and-drop test context, like so:
  // const CellContext = wrapInTestContext(DraggableCell);
  const cell = {
    type: contentType || ContentType.SNIPPET,
    contentId: contentId || "snippet-id"
  };
  const id = "cell-id";
  const index = 1;
  const wrapper = shallow(<Cell {...{ id, cell, contentType, index }} />);
  return { wrapper };
}

/**
 * We can't test much about the props affect the editor, because the test setup doesn't let us
 * initialize MonacoEditor in the tests. For any important logic that maps from props to
 * editor state and back, make helper functions and test those.
 */
describe("Cell", () => {
  it("renders snippets", () => {
    const { wrapper } = setup(ContentType.SNIPPET);
    const snippet = wrapper.find(connected("Snippet"));
    expect(snippet.length).toBe(1);
  });

  it("renders outputs", () => {
    const { wrapper } = setup(ContentType.OUTPUT, {
      snippetId: "snippet-id",
      commandId: "command-id"
    } as OutputId);
    const output = wrapper.find(connected("Output"));
    expect(output.length).toBe(1);
  });
});
