import * as actions from "../../../store/steps/actions";
import * as types from "../../../store/steps/types";

describe("actions", () => {
  it("should create an action for adding a line", () => {
    const lineVersionId = "line-version-id";
    const stepId = "step-id";
    const expectedAction = {
      lineVersionId,
      stepId,
      type: types.ADD_LINE
    };
    expect(actions.addLine(stepId, lineVersionId)).toEqual(expectedAction);
  });
});