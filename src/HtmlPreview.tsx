import styled from "@material-ui/core/styles/styled";
import React, { useEffect, useRef } from "react";

export function HtmlPreview(props: HtmlPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current !== null && props.html !== undefined) {
      const iframe = iframeRef.current;
      if (iframe.contentWindow !== null) {
        loadIFrameContents(iframe, props.html);
      }
    }
  }, [iframeRef, props.html]);

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
    iframe.onload = () => fitIFrameToContents(iframe);
  }
}

function fitIFrameToContents(iframe: HTMLIFrameElement) {
  if (iframe.contentWindow !== null) {
    iframe.style.width = "auto";
    iframe.style.height = "auto";
    iframe.style.width = iframe.contentWindow.document.body.scrollWidth + "px";
    iframe.style.width = iframe.contentWindow.document.body.scrollHeight + "px";
  }
}

interface HtmlPreviewProps {
  /**
   * 'undefined' HTML will not be processed; the frame will preserve its prior HTML.
   */
  html: string | undefined;
  className?: string;
}

export default styled(HtmlPreview)(({ theme }) => ({
  textAlign: "center",
  "& iframe": {
    border: "none"
  }
}));
