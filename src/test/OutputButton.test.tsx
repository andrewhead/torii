import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { Output } from "santoku-store";
import { OutputButton } from "../OutputButton";
import { styled, withTheme } from "./util";

Enzyme.configure({ adapter: new Adapter() });

const id = {
  snippetId: "snippet-id",
  commandId: "command-id"
};

describe("OutputButton", () => {
  it("should show progress if unfinished", () => {
    const output: Output = {
      commandId: "command-id",
      state: "started",
      type: "console"
    };
    const wrapper = shallow(<OutputButton id={id} output={output} cellIndex={0} />);
    const progress = wrapper.find(styled(withTheme("ContrastCircularProgress")));
    expect(progress.length).toBe(1);
  });

  it("should have text for the output type", () => {
    const output: Output = {
      commandId: "command-id",
      state: "started",
      type: "console"
    };
    const wrapper = shallow(<OutputButton id={id} output={output} />);
    expect(wrapper.text()).toEqual("Console output");
  });
});
