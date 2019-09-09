import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { OutputButton } from "../../widgets/OutputButton";

Enzyme.configure({ adapter: new Adapter() });

const id = {
  snippetId: "snippet-id",
  commandId: "command-id"
};

describe("OutputButton", () => {
  function shallowOutputButton() {
    const type = "console";
    return shallow(<OutputButton id={id} type={type} cellIndex={0} insertOutput={jest.fn()} />);
  }

  it("should have text for the output type", () => {
    const wrapper = shallowOutputButton();
    expect(wrapper.text()).toMatch(/add console output/i);
  });
});
