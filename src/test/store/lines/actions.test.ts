import * as actions from "../../../store/lines/actions";
import * as types from "../../../store/lines/types";

describe("actions", () => {
  it.only("should create an action for updating text", () => {
    const lineVersionId = "id";
    const text = "Updated text";
    const expectedAction = {
      lineVersionId,
      text,
      type: types.UPDATE_TEXT
    };
    expect(actions.updateText(lineVersionId, text)).toEqual(expectedAction);
  });
});