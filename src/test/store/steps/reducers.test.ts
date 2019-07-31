import { addLine } from "../../../store/steps/actions";
import { stepsByIdReducer } from "../../../store/steps/reducers";

describe("steps reducer", () => {
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
