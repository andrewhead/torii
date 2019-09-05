import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { Output } from "santoku-store";
import { OutputButton, StyledContrastCircularProgress } from "../OutputButton";

Enzyme.configure({ adapter: new Adapter() });

const id = {
  snippetId: "snippet-id",
  commandId: "command-id"
};

describe("OutputButton", () => {
  function shallowOutputButton() {
    const output: Output = {
      commandId: "command-id",
      state: "started",
      type: "console"
    };
    return shallow(<OutputButton id={id} output={output} cellIndex={0} insertOutput={jest.fn()} />);
  }

  it("should show progress if unfinished", () => {
    const wrapper = shallowOutputButton();
    const progress = wrapper.find(StyledContrastCircularProgress);
    expect(progress.length).toBe(1);
  });

  it("should have text for the output type", () => {
    const wrapper = shallowOutputButton();
    expect(wrapper.text()).toMatch(/add console output/i);
  });
});
