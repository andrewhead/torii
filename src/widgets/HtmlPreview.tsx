import { Theme } from "@material-ui/core/styles";
import styled from "@material-ui/core/styles/styled";
import withTheme from "@material-ui/core/styles/withTheme";
import React, { useEffect, useRef } from "react";

export function HtmlPreview(props: HtmlPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current !== null && props.html !== undefined) {
      const iframe = iframeRef.current;
      iframe.onload = () => fitIFrameToContents(iframe, props.theme);
      if (iframe.contentWindow !== null) {
        loadIFrameContents(iframe, props.html);
      }
    }
  }, [iframeRef, props.html, props.theme]);

  return (
    <div className={`html-preview ${props.className !== undefined && props.className}`}>
      <iframe ref={iframeRef} />
    </div>
  );
}

function loadIFrameContents(iframe: HTMLIFrameElement, html: string) {
  if (iframe.contentWindow !== null) {
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }
}

function fitIFrameToContents(iframe: HTMLIFrameElement, theme?: Theme) {
  const borderWidth = theme ? theme.shape.borderWidth : 0;
  if (iframe.contentWindow !== null) {
    /*
     * iframe margin is non-zero by default. Set to zero so no margin around content.
     */
    iframe.contentWindow.document.body.style.margin = "0";
    iframe.style.width = "auto";
    iframe.style.height = "auto";
    iframe.style.width = iframe.contentWindow.document.body.scrollWidth + borderWidth + "px";
    iframe.style.height = iframe.contentWindow.document.body.scrollHeight + borderWidth + "px";
  }
}

interface HtmlPreviewProps {
  /**
   * 'undefined' HTML will not be processed; the frame will preserve its prior HTML.
   */
  html: string | undefined;
  className?: string;
  theme?: Theme;
}

export default styled(withTheme(HtmlPreview))(({ theme }) => ({
  textAlign: "center",
  "& iframe": {
    borderStyle: "solid",
    borderColor: theme.palette.primary.main,
    borderWidth: theme.shape.borderWidth,
    borderRadius: theme.shape.borderRadius
  }
}));
