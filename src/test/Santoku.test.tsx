import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import configureMockStore from "redux-mock-store";
import { Cells, ContentType } from "santoku-store";
import { Santoku } from "../Santoku";
import { dragSource, dropTarget, styled } from "./util";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore();

function setup() {
  const cells: Cells = {
    all: ["id-0", "id-1"],
    byId: {
      "id-0": { contentId: "content-id-0", type: ContentType.SNIPPET },
      "id-1": { contentId: "content-id-1", type: ContentType.SNIPPET }
    }
  };
  const store = mockStore();
  /**
   * Must pass in store as context, as connected components (e.g., Snippet) are expecting it as
   * a property. Unnecessary for components without connected component children.
   */
  const wrapper = shallow(<Santoku cells={cells} />, { context: store });
  return {
    wrapper
  };
}

describe("Santoku", () => {
  it("should render self and subcomponents", () => {
    const { wrapper } = setup();
    const cells = wrapper.find(dropTarget(dragSource(styled("ForwardRef"))));
    expect(cells.length).toBe(2);
    expect(cells.get(0).key).toEqual("id-0");
    expect(cells.get(1).key).toEqual("id-1");
  });
});
