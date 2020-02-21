import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { Output as OutputState } from "torii-store";
import ConsoleOutput from "../../widgets/ConsoleOutput";
import HtmlOutput from "../../widgets/HtmlOutput";
import { Output } from "../../widgets/Output";

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

  it("should render an HTML output if 'type' is 'html'", () => {
    const output: OutputState = {
      commandId: "command-id",
      state: "started",
      type: "html"
    };
    const props = { output };
    const wrapper = shallow(<Output {...props} />);
    const htmlOutput = wrapper.find(HtmlOutput);
    expect(htmlOutput.length).toBe(1);
  });
});
