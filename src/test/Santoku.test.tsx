import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import configureMockStore from "redux-mock-store";
import { Santoku } from "../Santoku";
import { connected, createText } from "./util";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore();

function setup() {
  const text = createText({
    snippets: {
      all: ["0"],
      byId: {
        0: {
          chunkVersionsAdded: []
        }
      }
    }
  });
  const store = mockStore();
  /**
   * Must pass in store as context, as connected components (e.g., Snippet) is expecting it as
   * a property. Unnecessary for components without connected component children.
   */
  const wrapper = shallow(<Santoku text={text} />, { context: store });
  return {
    wrapper
  };
}

describe("Santoku", () => {
  it("should render self and subcomponents", () => {
    const { wrapper } = setup();
    const snippets = wrapper.find(connected("Snippet"));
    expect(snippets.length).toBe(1);
    expect(snippets.getElement().key).toEqual("0");
  });
});
