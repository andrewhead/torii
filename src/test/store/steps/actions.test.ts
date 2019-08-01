import * as actions from "../../../store/steps/actions";
import * as types from "../../../store/steps/types";

describe("actions", () => {
  it("should create an action for creating a step", () => {
    const index = 0;
    const action = actions.createStep(index);
    expect(action).toMatchObject({
      index,
      type: types.CREATE_STEP
    });
    expect(action.id).toMatch(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
    );
  });

  it("should create an action for adding a line", () => {
    const lineVersionId = "line-version-id";
    const stepId = "step-id";
    const expectedAction = {
      lineVersionId,
      stepId,
      type: types.ADD_LINE_TO_STEP
    };
    expect(actions.addLine(stepId, lineVersionId)).toEqual(expectedAction);
  });
});
