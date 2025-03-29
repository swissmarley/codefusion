import React, { useEffect, useRef } from "react";

function CodePreview({ code }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && isLikelyHtml(code)) {
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(code);
      doc.close();
    }
  }, [code]);

  const isLikelyHtml = (content) => {
    const lowerContent = content.toLowerCase();
    // A naive check for <html>, <body>, <head>
    return (
      lowerContent.includes("<html>") ||
      lowerContent.includes("<body>") ||
      lowerContent.includes("<head>")
    );
  };

  if (!code.trim()) {
    return <div style={{ fontStyle: "italic" }}>No preview available</div>;
  }

  if (!isLikelyHtml(code)) {
    return (
      <div style={{ fontStyle: "italic" }}>
        Preview is available only for HTML/CSS/JS code.
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <h3>Preview</h3>
      <iframe
        ref={iframeRef}
        title="Generated Preview"
        style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}
      />
    </div>
  );
}

export default CodePreview;