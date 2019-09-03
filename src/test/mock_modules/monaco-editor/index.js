import * as React from "react";

/**
 * This file should have just enough mocks to allow the tests to pass.
 */

export default function MonacoEditor() {
  return <div />;
}

export const editor = {
  ContentWidgetPositionPreference: {
    ABOVE: "above",
    BELOW: "below",
    EXACT: "exact"
  }
};
