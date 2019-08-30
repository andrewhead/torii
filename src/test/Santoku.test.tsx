import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import configureMockStore from "redux-mock-store";
import { Santoku } from "../Santoku";
import { connected, dragSource, dropTarget, styled } from "./util";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore();

function setup() {
  const cellIds = ["id-0", "id-1"];
  /**
   * Must pass in store as context, as connected components (e.g., Snippet) are expecting it as
   * a property. Unnecessary for components without connected component children.
   */
  const wrapper = shallow(<Santoku cellIds={cellIds} />);
  return {
    wrapper
  };
}

describe("Santoku", () => {
  it("should render self and subcomponents", () => {
    const { wrapper } = setup();
    const cells = wrapper.find(connected(dropTarget(dragSource(styled("ForwardRef")))));
    expect(cells.length).toBe(2);
    expect(cells.get(0).key).toEqual("id-0");
    expect(cells.get(1).key).toEqual("id-1");
  });
});
