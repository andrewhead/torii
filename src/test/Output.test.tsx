import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { Output as OutputState } from "santoku-store";
import ConsoleOutput from "../ConsoleOutput";
import { Output } from "../Output";

Enzyme.configure({ adapter: new Adapter() });

describe("Output", () => {
  it("should render a console output if 'type' is 'console'", () => {
    const output: OutputState = {
      commandId: "command-id",
      state: "started",
      type: "console"
    };
    const props = { output };
    const wrapper = shallow(<Output {...props} />);
    const consoleOutput = wrapper.find(ConsoleOutput);
    expect(consoleOutput.length).toBe(1);
  });
});
