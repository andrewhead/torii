import { getSnippetIndexContentWidgets } from "../SnapshotEditor";

describe("getSnippetIndexContentWidgets", () => {
  it("creates content widgets", () => {
    const snippetOffsets = [
      { snippetId: "snippet-0", snippetIndex: 0, line: 1 },
      { snippetId: "snippet-1", snippetIndex: 1, line: 2 }
    ];
    const widgets = getSnippetIndexContentWidgets(snippetOffsets, 4);
    const widget = widgets[0];
    expect(widget.allowEditorOverflow).toBe(false);
    expect(widget.getDomNode().textContent).toMatch(/snippet 1/i);
    expect(widget.getPosition()).toMatchObject({
      position: {
        lineNumber: 1,
        column: Number.POSITIVE_INFINITY
      }
    });
    expect(widgets[1].getPosition()).toMatchObject({
      position: {
        lineNumber: 4
      }
    });
  });
});
