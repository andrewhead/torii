import { SnippetId, State } from "santoku-store";

export function getCommandIds(state: State, snippetId: SnippetId) {
  const outputs = state.outputs.byId[snippetId];
  if (outputs !== undefined) {
    return Object.keys(outputs);
  }
  return [];
}
