import { createLine, updateText } from "../../../store/lines/actions";
import {
  allLineVersionsReducer,
  lineVersionsByIdReducer,
  allLinesReducer,
  linesByIdReducer
} from "../../../store/lines/reducers";
import { AllLineVersions, AllLines } from "../../../store/lines/types";

const LINE_LOCATION = { path: "path", index: 0 };

describe("all lines reducer", () => {
  it("should handle CREATE_LINE", () => {
    const allLines: AllLines = [];
    const action = createLine(LINE_LOCATION);
    expect(allLinesReducer(allLines, action)).toEqual([action.id]);
  });
});

describe("lines by ID reducer", () => {
  describe("should handle CREATE_LINE", () => {
    it("should add a line", () => {
      const linesById = {};
      const action = createLine(LINE_LOCATION);
      expect(linesByIdReducer(linesById, action)).toEqual({
        [action.id]: {
          location: LINE_LOCATION,
          versions: []
        }
      });
    });

    it("should add the line's initial version", () => {
      const linesById = {};
      const initialVersionText = "Initial version text";
      const action = createLine(LINE_LOCATION, initialVersionText);
      expect(linesByIdReducer(linesById, action)).toMatchObject({
        [action.id]: {
          versions: [action.initialVersionId]
        }
      });
    });

    it("should not move other lines", () => {
      const locationAfter = { index: 2, path: "same-path" };
      const linesById = {
        "line-after": {
          location: locationAfter,
          versions: []
        }
      };
      const newLineLocation = { index: 1, path: "same-path" };
      expect(
        linesByIdReducer(linesById, createLine(newLineLocation))
      ).toMatchObject({
        "line-after": {
          location: locationAfter
        }
      });
    });

    it("should insert a line", () => {
      const locationBefore = { index: 0, path: "same-path" };
      const locationAt = { index: 1, path: "same-path" };
      const locationAfter = { index: 2, path: "same-path" };
      const locationInOtherFile = { index: 2, path: "other-path" };
      const linesById = {
        "line-after": { location: locationAfter, versions: [] },
        "line-at": { location: locationAt, versions: [] },
        "line-before": { location: locationBefore, versions: [] },
        "line-in-other-file": { location: locationInOtherFile, versions: [] }
      };
      const insertLocation = { index: 1, path: "same-path" };
      const action = createLine(insertLocation, undefined, true);
      const updatedLinesById = linesByIdReducer(linesById, action);
      expect(updatedLinesById).toMatchObject({
        "line-after": { location: { index: 3 } },
        "line-at": { location: { index: 2 } },
        "line-before": { location: locationBefore },
        "line-in-other-file": { location: locationInOtherFile },
        [action.id]: { location: insertLocation }
      });
    });
  });
});

describe("all line versions reducer", () => {
  describe("should handle CREATE_LINE", () => {
    it("should not add a line version", () => {
      const allLineVersions: AllLineVersions = [];
      expect(
        allLineVersionsReducer(allLineVersions, createLine(LINE_LOCATION))
      ).toBe(allLineVersions);
    });

    it("should add a line version", () => {
      const allLineVersions: AllLineVersions = [];
      const action = createLine(LINE_LOCATION, "Non-null initial version text");
      const updatedAllLineVersions = allLineVersionsReducer(
        allLineVersions,
        action
      );
      expect(action.initialVersionId).not.toBeUndefined();
      if (action.initialVersionId !== undefined) {
        expect(updatedAllLineVersions).toContain(action.initialVersionId);
      }
    });
  });
});

describe("line versions by ID reducer", () => {
  it("should handle UPDATE_TEXT", () => {
    const lineVersionsById = {
      id: {
        line: "line-id",
        text: "Initial text"
      }
    };
    expect(
      lineVersionsByIdReducer(
        lineVersionsById,
        updateText("id", "Updated text")
      )
    ).toEqual({
      id: {
        line: "line-id",
        text: "Updated text"
      }
    });
  });

  describe("should handle CREATE_LINE", () => {
    it("should not add a line version", () => {
      const lineVersionsById = {};
      const location = { path: "path", index: 0 };
      expect(
        lineVersionsByIdReducer(lineVersionsById, createLine(LINE_LOCATION))
      ).toBe(lineVersionsById);
    });

    it("should add a line version", () => {
      const lineVersionsById = {};
      const initialVersionText = "Initial text";
      const action = createLine(LINE_LOCATION, initialVersionText);
      const updatedLineVersionsById = lineVersionsByIdReducer(
        lineVersionsById,
        action
      );
      expect(action.initialVersionId).not.toBeUndefined();
      if (action.initialVersionId !== undefined) {
        expect(updatedLineVersionsById[action.initialVersionId]).toEqual({
          line: action.id,
          text: initialVersionText
        });
      }
    });
  });
});
