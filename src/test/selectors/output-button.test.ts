import { Output, stateUtils } from "santoku-store";
import { getOutput } from "../../selectors/output-button";

describe("getOutput", () => {
  it("gets output for a snippet and command", () => {
    const output = { commandId: "command-id", state: "started", type: "console" } as Output;
    const state = stateUtils.createState({
      outputs: {
        all: ["snippet-id"],
        byId: {
          "snippet-id": {
            "command-id": output
          }
        }
      }
    });
    expect(getOutput(state, "snippet-id", "command-id")).toEqual(output);
  });
});
