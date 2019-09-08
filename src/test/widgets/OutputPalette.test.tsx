import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import OutputButton from "../../widgets/OutputButton";
import { OutputPalette } from "../../widgets/OutputPalette";

Enzyme.configure({ adapter: new Adapter() });

describe("OutputPalette", () => {
  it("should render OutputButtons", () => {
    const snippetId = "snippet-0";
    const commandIds = ["command-0", "command-1"];
    const props = { snippetId, commandIds };
    const wrapper = shallow(<OutputPalette {...props} cellIndex={0} />);
    const outputButtons = wrapper.find(OutputButton);
    expect(outputButtons.length).toBe(2);
  });
});
