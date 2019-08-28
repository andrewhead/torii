import { CommandId, SnippetId, State } from "santoku-store";

/**
 * Assumes there is an output in state with this snippet ID and command ID.
 */
export function getOutput(state: State, snippetId: SnippetId, commandId: CommandId) {
  return state.outputs.byId[snippetId][commandId];
}
