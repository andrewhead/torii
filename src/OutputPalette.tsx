import { styled } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import { CommandId, OutputId, SnippetId, State } from "santoku-store";
import OutputButton from "./OutputButton";
import { getCommandIds } from "./selectors/output-palette";

export function OutputPalette(props: OutputPaletteProps) {
  return (
    <div className={`output-palette ${props.className !== undefined && props.className}`}>
      {props.commandIds.map(commandId => {
        const outputId: OutputId = {
          snippetId: props.snippetId,
          commandId
        };
        return <OutputButton key={commandId} id={outputId} />;
      })}
    </div>
  );
}

const StyledOutputPalette = styled(OutputPalette)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(1),
  right: theme.spacing(1)
}));

interface OutputPaletteOwnProps {
  snippetId: SnippetId;
}

interface OutputPaletteProps {
  snippetId: SnippetId;
  commandIds: CommandId[];
  className?: string;
}

export default connect(
  (state: State, ownProps: OutputPaletteOwnProps): OutputPaletteProps => {
    return {
      snippetId: ownProps.snippetId,
      commandIds: getCommandIds(state, ownProps.snippetId)
    };
  }
)(StyledOutputPalette);
