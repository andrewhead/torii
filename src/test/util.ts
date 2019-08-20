import { DeepPartial } from "redux";
import { Text } from "santoku-store";

export function connected(componentName: string) {
  return `Connect(${componentName})`;
}

export function createText(partialState?: DeepPartial<Text>): Text {
  const emptyState = {
    chunkVersions: { all: [], byId: {} },
    chunks: { all: [], byId: {} },
    snippets: { all: [], byId: {} },
    visibilityRules: {},
    selections: []
  };
  return Object.assign({}, emptyState, partialState);
}
