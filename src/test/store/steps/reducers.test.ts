import { addLine, createStep } from "../../../store/steps/actions";
import { allStepsReducer, stepsByIdReducer } from "../../../store/steps/reducers";

describe("all steps reducer", () => {

  describe("should handle CREATE_STEP", () => {
    it("should insert a step at the index", () => {
      const allSteps = ["0"];
      const createStepAction = createStep(0);
      expect(
        allStepsReducer(allSteps, createStepAction)
      ).toEqual([createStepAction.id, "0"]);
    });
  });
});

describe("steps by ID reducer", () => {

  describe("should handle CREATE_STEP", () => {
    it("should add a step", () => {
      const stepsById = {};
      const updatedStepsById = stepsByIdReducer(stepsById, createStep(0));
      expect(
        Object.keys(updatedStepsById)
      ).toHaveLength(1);
    });
  });

  describe("should handle ADD_LINE", () => {
    it("should add a line", () => {
      const stepsById = {
        "step-id": {
          linesAdded: [],
          linesRemoved: []
        }
      };
      expect(
        stepsByIdReducer(stepsById, addLine("step-id", "line-version-id"))
      ).toEqual({
        "step-id": {
          linesAdded: ["line-version-id"],
          linesRemoved: []
        }
      });
    });

    it("shouldn't add a line that was already added", () => {
      const stepsById = {
        "step-id": {
          linesAdded: ["line-version-id"],
          linesRemoved: []
        }
      };
      expect(
        stepsByIdReducer(stepsById, addLine("step-id", "line-version-id"))
      ).toEqual({
        "step-id": {
          linesAdded: ["line-version-id"],
          linesRemoved: []
        }
      })
    })
  });
});
