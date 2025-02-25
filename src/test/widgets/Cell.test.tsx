import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { Cell as CellState, ContentType } from "torii-store";
import { Cell } from "../../widgets/Cell";
import Output from "../../widgets/Output";
import Snippet from "../../widgets/Snippet";
import Text from "../../widgets/Text";

Enzyme.configure({ adapter: new Adapter() });

/**
 * We can't test much about the props affect the editor, because the test setup doesn't let us
 * initialize MonacoEditor in the tests. For any important logic that maps from props to
 * editor state and back, make helper functions and test those.
 *
 * To test test drag-and-drop behavior of cells, you will need to test DraggableCell.
 * You may need to provide a drag-and-drop test context, like so:
 * const CellContext = wrapInTestContext(DraggableCell);
 */
describe("Cell", () => {
  function createCell(cell: CellState, id: any, index: number) {
    const { type, contentId, hidden } = cell;
    return shallow(
      <Cell
        {...{ id, type, contentId, index, hidden }}
        selected={true}
        move={jest.fn()}
        selectCell={jest.fn()}
        show={jest.fn()}
      />
    );
  }

  it("renders snippets", () => {
    const cell = {
      type: ContentType.SNIPPET,
      contentId: "snippet-id"
    } as CellState;
    const id = "cell-id";
    const index = 1;
    const wrapper = createCell(cell, id, index);
    const snippet = wrapper.find(Snippet);
    expect(snippet.length).toBe(1);
  });

  it("renders outputs", () => {
    const cell = {
      type: ContentType.OUTPUT,
      contentId: {
        snippetId: "snippet-id",
        commandId: "command-id"
      }
    } as CellState;
    const id = "cell-id";
    const index = 1;
    const wrapper = createCell(cell, id, index);
    const output = wrapper.find(Output);
    expect(output.length).toBe(1);
  });

  it("renders text", () => {
    const cell = {
      type: ContentType.TEXT,
      contentId: "text-id"
    } as CellState;
    const id = "cell-id";
    const index = 1;
    const wrapper = createCell(cell, id, index);
    const text = wrapper.find(Text);
    expect(text.length).toBe(1);
  });
});
