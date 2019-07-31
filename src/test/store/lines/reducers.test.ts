import { updateText } from "../../../store/lines/actions";
import { lineVersionsByIdReducer } from "../../../store/lines/reducers";

describe("line versions reducer", () => {
  it("should handle UPDATE_TEXT", () => {
    const lineVersionsById = {
      id: {
        line: "line-id",
        text: "Initial text",
        version: 0
      }
    };
    expect(
      lineVersionsByIdReducer(lineVersionsById, 
        updateText("id", "Updated text")
    )).toEqual({
      id: {
        line: "line-id",
        text: "Updated text",
        version: 0
      }
    });
  });
});
