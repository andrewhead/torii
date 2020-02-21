import { Path, selectors, SnippetId, State } from "torii-store";
import { SnippetEditorBaseProps } from "./types";

export function getSnippetEditorProps(
  state: State,
  snippetId: SnippetId,
  path: Path
): SnippetEditorBaseProps {
  const { partialProgram, lineTexts } = selectors.code.getSnippetPartialProgram(
    state,
    snippetId,
    path
  );
  return {
    ...partialProgram,
    lineNumbers: lineTexts.map(l => l.offset)
  };
}
