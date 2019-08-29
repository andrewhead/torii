import { OutputId, State } from "santoku-store";

/**
 * Assumes there is an output in state with this ID.
 */
export function getOutput(state: State, outputId: OutputId) {
  return state.outputs.byId[outputId.snippetId][outputId.commandId];
}
