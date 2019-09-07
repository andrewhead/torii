import { styled, Theme, withTheme } from "@material-ui/core/styles";
import * as React from "react";
import { RefObject, useEffect, useRef, useState } from "react";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import { connect } from "react-redux";
import { actions, State, TextId } from "santoku-store";
import Showdown from "showdown";
import { getValue } from "./selectors/text";

export function Text(props: TextProps) {
  const ref = useRef<ReactMde>(null);
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

  useEffect(() => {
    setSelectedTab(props.focused ? "write" : "preview");
  }, [props.focused]);

  useEffect(() => {
    resizeTextArea(ref);
  }, [props.value]);

  useEffect(() => {
    if (selectedTab === "write") {
      focusTextArea(ref);
      resizeTextArea(ref);
    }
  }, [selectedTab]);

  return (
    <ReactMde
      ref={ref}
      value={props.value || ""}
      className={`${props.focused && "focused"}
        ${props.className !== undefined && props.className}`}
      onChange={value => props.setText(props.id, value)}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      generateMarkdownPreview={markdown => Promise.resolve(markdownRenderer.makeHtml(markdown))}
      minPreviewHeight={0}
    />
  );
}

const markdownRenderer = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true
});

function focusTextArea(reactMdeRef: RefObject<ReactMde>) {
  if (reactMdeRef.current !== null && reactMdeRef.current.textAreaRef !== null) {
    reactMdeRef.current.textAreaRef.focus();
  }
}

function resizeTextArea(reactMdeRef: RefObject<ReactMde>, theme?: Theme) {
  const padding = theme !== undefined ? theme.spaces.text.padding : 0;
  if (reactMdeRef.current !== null && reactMdeRef.current.textAreaRef !== null) {
    /*
     * Text area resizing trick proposed at: https://stackoverflow.com/a/25621277/2096369.
     */
    const textarea = reactMdeRef.current.textAreaRef;
    const newHeight = padding * 2 + textarea.scrollHeight + "px";
    if (textarea.style.height !== newHeight) {
      textarea.style.height = "auto";
      textarea.style.height = padding * 2 + textarea.scrollHeight + "px";
    }
  }
}

interface TextOwnProps {
  id: TextId;
  focused: boolean;
}

interface TextProps extends TextActions {
  id: TextId;
  value: string | undefined;
  focused: boolean;
  className?: string;
  theme?: Theme;
}

interface TextActions {
  setText: typeof actions.texts.setText;
}

const actionCreators = {
  setText: actions.texts.setText
};

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
      fontSize: theme.typography.text.fontSize,
      lineHeight: theme.typography.text.lineHeight
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
    lineHeight: theme.typography.text.lineHeight,
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
  (state: State, ownProps: TextOwnProps) => {
    return {
      id: ownProps.id,
      focused: ownProps.focused,
      value: getValue(state, ownProps.id)
    };
  },
  actionCreators
)(StyledText);
