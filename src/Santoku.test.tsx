import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { DeepPartial } from "redux";
import { Text } from "santoku-store";
import { Santoku } from "./Santoku";

Enzyme.configure({ adapter: new Adapter() });

function createText(partialState?: DeepPartial<Text>): Text {
  const emptyState = {
    chunkVersions: { all: [], byId: {} },
    chunks: { all: [], byId: {} },
    snippets: { all: [], byId: {} },
    visibilityRules: {}
  };
  return Object.assign({}, emptyState, partialState);
}

function setup() {
  const props = {
    text: createText({
      snippets: {
        all: ["0"],
        byId: {
          0: {
            chunkVersionsAdded: []
          }
        }
      }
    })
  };
  const enzymeWrapper = shallow(<Santoku {...props} />);
  return {
    enzymeWrapper
  };
}

describe("Santoku", () => {
  it("should render self and subcomponents", () => {
    const { enzymeWrapper } = setup();
    const snippets = enzymeWrapper.find("Snippet");
    expect(snippets.length).toBe(1);
    expect(snippets.getElement().key).toEqual("0");
  });
});
