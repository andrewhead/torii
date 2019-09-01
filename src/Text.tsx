import { styled, Theme, withTheme } from "@material-ui/core/styles";
import * as React from "react";
import { RefObject, useEffect, useRef, useState } from "react";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import { connect } from "react-redux";
import { actions, State, store, TextId } from "santoku-store";
import Showdown from "showdown";
import { getValue } from "./selectors/text";

export function Text(props: TextProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

  useEffect(() => {
    setSelectedTab(props.focused ? "write" : "preview");
  }, [props.focused]);

  useEffect(() => {
    if (selectedTab === "write") {
      focusTextArea(ref);
      resizeTextArea(ref);
    }
  }, [selectedTab]);

  return (
    <ReactMde
      value={props.value || ""}
      className={`${props.focused && "focused"}
        ${props.className !== undefined && props.className}`}
      onChange={value => {
        store.dispatch(actions.texts.setText(props.id, value));
        resizeTextArea(ref);
      }}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      generateMarkdownPreview={markdown => Promise.resolve(markdownRenderer.makeHtml(markdown))}
      textAreaProps={{ ref }}
      minPreviewHeight={0}
    />
  );
}

const markdownRenderer = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true
});

function focusTextArea(textAreaRef: RefObject<HTMLTextAreaElement>) {
  const textarea = textAreaRef.current;
  if (textarea !== null) {
    textarea.focus();
  }
}

function resizeTextArea(textAreaRef: RefObject<HTMLTextAreaElement>, theme?: Theme) {
  const textarea = textAreaRef.current;
  const padding = theme !== undefined ? theme.spaces.text.padding : 0;
  if (textarea !== null) {
    /*
     * Text area resizing trick proposed at: https://stackoverflow.com/a/25621277/2096369.
     */
    textarea.style.height = "auto";
    textarea.style.height = padding * 2 + textarea.scrollHeight + "px";
  }
}

interface TextOwnProps {
  id: TextId;
  focused: boolean;
}

interface TextProps {
  id: TextId;
  value: string | undefined;
  focused: boolean;
  className?: string;
  theme?: Theme;
}

/*
 * Override the styles for the Markdown editor. It should match the aesthetic for the rest of the
 * application. Some elements of the editor should be hidden when the editor is not selected.
 */
const StyledText = styled(withTheme(Text))(({ theme }) => ({
  fontFamily: theme.typography.text.fontFamily + " !important",
  border: "none",
  "& .mde-header": {
    border: "none",
    backgroundColor: theme.palette.primary.main
  },
  "&:not(.focused)": {
    "& .mde-header": {
      display: "none"
    },
    "& .mde-preview-content": {
      padding: 0
    }
  },
  "& button": {
    fontFamily: theme.typography.text.fontFamily + " !important"
  },
  "& .mde-preview": {
    "& h1,h2,h3": {
      borderBottom: "0 !important"
    },
    "& p": {
      fontSize: theme.typography.text.fontSize
    },
    "& code": {
      fontFamily: theme.typography.code.fontFamily,
      fontSize: theme.typography.code.fontSize,
      backgroundColor: theme.palette.primaryScale[300],
      color: "black"
    }
  },
  "& textarea": {
    padding: theme.spaces.text.padding,
    fontFamily: theme.typography.text.fontFamily + " !important",
    fontSize: theme.typography.text.fontSize,
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 5px " + theme.palette.secondaryScale[200]
    }
  },
  "& .grip": {
    display: "none"
  }
}));

export default connect(
  (state: State, ownProps: TextOwnProps): TextProps => {
    return {
      id: ownProps.id,
      focused: ownProps.focused,
      value: getValue(state, ownProps.id)
    };
  }
)(StyledText);
