import { styled } from "@material-ui/core/styles";
import * as React from "react";
import { RefObject, useEffect, useRef, useState } from "react";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import { connect } from "react-redux";
import { actions, State, store, TextId } from "santoku-store";
import Showdown from "showdown";
import { getValue } from "./selectors/text";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true
});

function updateTextAreaHeight(textAreaRef: RefObject<HTMLTextAreaElement>) {
  const textarea = textAreaRef.current;
  if (textarea !== null) {
    textarea.style.height = "1px";
    textarea.style.height = 8 + textarea.scrollHeight + "px";
  }
}

export function Text(props: TextProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

  useEffect(() => {
    if (props.focused === false) {
      setSelectedTab("preview");
    } else if (props.focused === true) {
      setSelectedTab("write");
    }
  }, [props.focused]);

  useEffect(() => {
    if (selectedTab === "write") {
      if (ref.current !== null) {
        ref.current.focus();
        updateTextAreaHeight(ref);
      }
    }
  }, [selectedTab]);

  const editor = (
    <ReactMde
      className={`${props.focused && "focused"}
        ${props.className !== undefined && props.className}`}
      value={props.value || ""}
      onChange={value => {
        store.dispatch(actions.texts.setText(props.id, value));
        updateTextAreaHeight(ref);
      }}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      generateMarkdownPreview={markdown => Promise.resolve(converter.makeHtml(markdown))}
      textAreaProps={{ ref }}
      minEditorHeight={49}
      minPreviewHeight={0}
    />
  );

  updateTextAreaHeight(ref);

  return editor;
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
}

const StyledText = styled(Text)(({ theme }) => ({
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
    fontFamily: theme.typography.text.fontFamily + " !important",
    fontSize: theme.typography.text.fontSize,
    "&:focus": {
      outline: "none",
      border: "2px solid " + theme.palette.secondaryScale[100],
      boxShadow: "0 0 10px " + theme.palette.secondaryScale[100]
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
