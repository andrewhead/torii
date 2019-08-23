import * as React from "react";
import { ContentId, ContentType } from "santoku-store";
import Snippet from "./Snippet";

/**
 * A 'cell' containing tutorial content. Can contain text, code, output, etc.
 */
export function Cell(props: CellProps) {
  return (
    <div className="cell">
      {props.contentType === ContentType.SNIPPET && <Snippet id={props.contentId} />}
    </div>
  );
}

interface CellProps {
  index: number;
  contentId: ContentId;
  contentType: ContentType;
}
