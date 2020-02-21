import { ContentType, Output, stateUtils, testUtils } from "torii-store";
import { getOutput } from "../../selectors/output-button";

describe("getOutput", () => {
  it("gets output with an ID", () => {
    const snippetId = "snippet-id";
    const commandId = "command-id";
    const snippetCellId = "snippet-cell-id";
    const outputCellId = "output-cell-id";

    // Create an output
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

    // Add two cells: the first contains a snippet; the second an output.
    state.undoable.present = testUtils.createChunks({
      cellId: snippetCellId,
      snippetId
    });
    state.undoable.present.cells.all.push(outputCellId);
    state.undoable.present.cells.byId[outputCellId] = {
      type: ContentType.OUTPUT,
      contentId: { commandId, snippetId },
      hidden: false
    };

    const outputCellIndex = 1;
    expect(getOutput(state, commandId, outputCellIndex)).toEqual(output);
  });
});
