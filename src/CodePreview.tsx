import * as React from "react";
import AceEditor from "react-ace";
import { IMarker } from "react-ace/lib/types";
import { Reason } from "./selectors/snippet";

/*
 * Use 'require' instead of 'import' as automatic organization of imports in VSCode puts these
 * statements above the other imports, which need to be run first.
 */
// tslint:disable-next-line: no-var-requires
require("brace/mode/java");
// tslint:disable-next-line: no-var-requires
require("brace/theme/github");

/**
 * Chosen to approximately match the default VSCode font size.
 */
const FONT_SIZE = 16;

export function CodePreview(props: CodePreviewProps) {
  const markers = props.reasons
    .map(
      (reason, i): IMarker | undefined => {
        return reason === Reason.REQUESTED_VISIBLE
          ? {
              className: "requested-visible",
              endCol: Number.POSITIVE_INFINITY,
              endRow: i,
              /*
               * Place marker in front because we want to use it to partially hide code: it's
               * to occlude code by putting the marker in front of it.
               */
              inFront: true,
              startCol: 0,
              startRow: i,
              type: "fullLine"
            }
          : undefined;
      }
    )
    .filter(m => m !== undefined);
  return (
    <AceEditor
      /* TODO set mode based on file extension */
      mode="java"
      theme="github"
      className="code-preview"
      value={props.text}
      /*
       * Setting max lines makes editor height reactive. Setting it to positive infinity means
       * that the editor will show all the lines in a snippet without a user needing to scroll.
       */
      maxLines={Number.POSITIVE_INFINITY}
      fontSize={FONT_SIZE}
      markers={markers as IMarker[]}
    />
  );
}

interface CodePreviewProps {
  text: string;
  reasons: Reason[];
}
