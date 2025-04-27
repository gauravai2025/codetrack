import React from "react";

const HtmlPage = ({ src }) => {
  return (
    <iframe
      src={src}
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
};

export default HtmlPage;
