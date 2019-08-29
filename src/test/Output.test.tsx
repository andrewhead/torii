import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { Output as OutputState } from "santoku-store";
import { Output } from "../Output";
import { styled } from "./util";

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const output: OutputState = {
    commandId: "command-id",
    state: "started",
    type: "console"
  };
  const props = { output };
  const wrapper = shallow(<Output {...props} />);
  return { wrapper };
}

describe("Output", () => {
  it("should render a console output if 'type' is 'console'", () => {
    const { wrapper } = setup();
    const consoleOutput = wrapper.find(styled("ConsoleOutput"));
    expect(consoleOutput.length).toBe(1);
  });
});
