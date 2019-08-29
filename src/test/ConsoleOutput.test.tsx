import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { Output } from "santoku-store";
import { ConsoleOutput } from "../ConsoleOutput";

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const output: Output = {
    commandId: "command-id",
    state: "started",
    type: "console",
    log: {
      contents: "Console output",
      stdoutRanges: [{ start: 0, end: 14 }],
      stderrRanges: []
    }
  };
  const props = { output };
  /*
   * Full element rendered to test text initialization.
   */
  const wrapper = mount(<ConsoleOutput {...props} />);
  return { wrapper };
}

describe("ConsoleOutput", () => {
  it("contains the console output", () => {
    const { wrapper } = setup();
    expect(wrapper.text()).toEqual("Console output");
  });
});
