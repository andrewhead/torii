import { Output, stateUtils } from "santoku-store";
import { getOutput } from "../../selectors/output-button";

describe("getOutput", () => {
  it("gets output with an ID", () => {
    const snippetId = "snippet-id";
    const commandId = "command-id";
    const output = { commandId, state: "started", type: "console" } as Output;
    const state = stateUtils.createState({
      outputs: {
        all: [snippetId],
        byId: {
          [snippetId]: {
            [commandId]: output
          }
        }
      }
    });
    const outputId = { snippetId, commandId };
    expect(getOutput(state, outputId)).toEqual(output);
  });
});
