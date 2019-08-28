import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { OutputPalette } from "../OutputPalette";
import { connected } from "./util";

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const snippetId = "snippet-0";
  const commandIds = ["command-0", "command-1"];
  const props = { snippetId, commandIds };
  const wrapper = shallow(<OutputPalette {...props} />);
  return {
    wrapper
  };
}

describe("OutputPalette", () => {
  it("should render OutputButtons", () => {
    const { wrapper } = setup();
    const outputButtons = wrapper.find(connected("OutputButton"));
    expect(outputButtons.length).toBe(2);
  });
});
