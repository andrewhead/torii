import { stateUtils } from "torii-store";
import { getCommandIds } from "../../selectors/output-palette";

describe("getCommandIds", () => {
  it("gets output command IDs for snippet", () => {
    const state = stateUtils.createState({
      outputs: {
        all: ["snippet-id"],
        byId: {
          "snippet-id": {
            "command-0": {
              commandId: "command-0",
              state: "started",
              type: "console"
            },
            "command-1": {
              commandId: "command-1",
              state: "started",
              type: "console"
            }
          }
        }
      }
    });
    expect(getCommandIds(state, "snippet-id")).toEqual([
      "command-0",
      "command-1"
    ]);
  });
});
