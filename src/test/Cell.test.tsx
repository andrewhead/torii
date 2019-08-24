import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { ContentType } from "santoku-store";
import { Cell } from "../Cell";
import { connected } from "./util";

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  // To test test drag-and-drop behavior of cells, you will need to test DraggableCell.
  // You may need to provide a drag-and-drop test context, like so:
  // const CellContext = wrapInTestContext(DraggableCell);
  const id = "cell-id";
  const contentId = "content-id";
  const contentType = ContentType.SNIPPET;
  const index = 1;
  const wrapper = shallow(<Cell {...{ id, contentId, contentType, index }} />);
  return { wrapper };
}

/**
 * We can't test much about the props affect the editor, because the test setup doesn't let us
 * initialize MonacoEditor in the tests. For any important logic that maps from props to
 * editor state and back, make helper functions and test those.
 */
describe("Cell", () => {
  it("should render its content", () => {
    const { wrapper } = setup();
    const snippet = wrapper.find(connected("Snippet"));
    expect(snippet.length).toBe(1);
  });
});
