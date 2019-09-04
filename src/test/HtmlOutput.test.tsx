import { LinearProgress } from "@material-ui/core";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { Output } from "santoku-store";
import { HtmlOutput } from "../HtmlOutput";
import HtmlPreview from "../HtmlPreview";

Enzyme.configure({ adapter: new Adapter() });

describe("HtmlOutput", () => {
  it("contains the HTML passed in", () => {
    const html = "<p>Hello world</p>";
    const output: Output = {
      commandId: "command-id",
      state: "finished",
      type: "html",
      value: html,
      log: {
        contents: "",
        stdoutRanges: [],
        stderrRanges: []
      }
    };
    /*
     * Only render shallow: the rendering of the iframe in the HtmlPreview will break
     * without complicated shims in the unit tests.
     */
    const wrapper = shallow(<HtmlOutput output={output} />);
    const preview = wrapper.find(HtmlPreview);
    expect(preview.length).toBe(1);
    expect(preview.prop("html")).toEqual(html);
  });

  it("contains progress bar when unfinished", () => {
    const output: Output = {
      commandId: "command-id",
      state: "started",
      type: "html"
    };
    const wrapper = shallow(<HtmlOutput output={output} />, {
      attachTo: document.createElement("div")
    });
    const progress = wrapper.find(LinearProgress);
    expect(progress.length).toBe(1);
    expect(wrapper.text()).toMatch(/generating/i);
  });
});
