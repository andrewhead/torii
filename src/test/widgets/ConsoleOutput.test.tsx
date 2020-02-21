import { LinearProgress } from "@material-ui/core";
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { Output } from "torii-store";
import { ConsoleOutput } from "../../widgets/ConsoleOutput";

Enzyme.configure({ adapter: new Adapter() });

describe("ConsoleOutput", () => {
  it("contains the console output", () => {
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
    /*
     * Full element rendered to test text initialization.
     */
    const wrapper = mount(<ConsoleOutput output={output} />);
    expect(wrapper.text()).toEqual("Console output");
  });

  it("contains progress bar when unfinished", () => {
    const output: Output = {
      commandId: "command-id",
      state: "started",
      type: "console"
    };
    const wrapper = shallow(<ConsoleOutput output={output} />);
    const progress = wrapper.find(LinearProgress);
    expect(progress.length).toBe(1);
  });
});
