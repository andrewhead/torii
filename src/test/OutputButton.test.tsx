import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { Output } from "santoku-store";
import { OutputButton } from "../OutputButton";

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const id = {
    snippetId: "snippet-id",
    commandId: "command-id"
  };
  const output: Output = {
    commandId: "command-id",
    state: "started",
    type: "console"
  };
  const props = { id, output };
  const wrapper = shallow(<OutputButton {...props} />);
  return {
    wrapper
  };
}

describe("OutputButton", () => {
  it("should have a class for command state", () => {
    const { wrapper } = setup();
    expect(wrapper.hasClass("command-state-started")).toBe(true);
  });
});
