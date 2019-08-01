import * as actions from "../../../store/lines/actions";
import * as types from "../../../store/lines/types";

describe("actions", () => {
  it("should create an action for updating text", () => {
    const lineVersionId = "id";
    const text = "Updated text";
    const expectedAction = {
      lineVersionId,
      text,
      type: types.UPDATE_TEXT
    };
    expect(actions.updateText(lineVersionId, text)).toEqual(expectedAction);
  });

  describe("should create an action for creating a line", () => {
    it("should not insert by default", () => {
      const location = {
        index: 0,
        path: "path"
      };
      const action = actions.createLine(location);
      expect(action).toMatchObject({
        initialVersionId: undefined,
        initialVersionText: undefined,
        insert: false,
        location,
        type: types.CREATE_LINE
      });
      expect(action.id).toMatch(
        /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
      );
    });

    it("should insert lines", () => {
      const location = {
        index: 0,
        path: "path"
      };
      expect(actions.createLine(location, undefined, true)).toMatchObject({
        insert: true
      });
    });

    it("should include initial version information", () => {
      const location = {
        index: 0,
        path: "path"
      };
      const initialVersionText = "Initial text";
      const action = actions.createLine(location, initialVersionText);
      expect(action).toMatchObject({
        initialVersionId: action.initialVersionId,
        initialVersionText
      });
    });
  });
});
