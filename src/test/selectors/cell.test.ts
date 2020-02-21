import { Cell, ContentType, testUtils } from "torii-store";
import { getCell, isSelected } from "../../../src/selectors/cell";

describe("getCell", () => {
  it("gets cell with ID", () => {
    const cellId = "cell-id";
    const cell: Cell = {
      contentId: "content-id",
      type: ContentType.SNIPPET,
      hidden: false
    };
    const state = testUtils.createStateWithUndoable({
      cells: {
        all: [cellId],
        byId: {
          [cellId]: cell
        }
      }
    });
    expect(getCell(state, cellId)).toEqual(cell);
  });
});

describe("isSelected", () => {
  it("detects a selected cell", () => {
    const cellId = "cell-id";
    const state = testUtils.createStateWithUndoable({ selectedCell: cellId });
    expect(isSelected(state, cellId)).toBe(true);
  });

  it("detects an unselected cell", () => {
    const cellId = "cell-id";
    const state = testUtils.createStateWithUndoable({
      selectedCell: "other-cell-id"
    });
    expect(isSelected(state, cellId)).toBe(false);
  });
});
