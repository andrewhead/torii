import * as React from "react";
import { connect } from "react-redux";
import { CommandId, SnippetId, State } from "santoku-store";
import OutputButton from "./OutputButton";

export function OutputPalette(props: OutputPaletteProps) {
  return (
    <div className="output-palette">
      {props.commandIds.map(commandId => (
        <OutputButton key={commandId} snippetId={props.snippetId} commandId={commandId} />
      ))}
    </div>
  );
}

interface OutputPaletteOwnProps {
  snippetId: SnippetId;
}

interface OutputPaletteProps {
  snippetId: SnippetId;
  commandIds: CommandId[];
}

export default connect(
  (state: State, ownProps: OutputPaletteOwnProps): OutputPaletteProps => {
    return {
      snippetId: "",
      commandIds: []
    };
  }
)(OutputPalette);
