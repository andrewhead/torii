import { testUtils } from "santoku-store";
import { getValue } from "../../../src/selectors/text";

describe("getValue", () => {
  it("gets text value", () => {
    const state = testUtils.createStateWithUndoable({
      texts: {
        all: ["text-id"],
        byId: {
          "text-id": { value: "value" }
        }
      }
    });
    expect(getValue(state, "text-id")).toBe("value");
  });
});
