import React, { useState } from "react";

const CodeModal = ({ code, closeModal }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000); // Reset copied state after 1 second
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center z-10 items-center bg-gray-800 bg-opacity-50">
      <div
        className="bg-gray-900 p-4 rounded shadow-md"
        style={{ width: "80%", maxWidth: "800px" }}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-white">View Code</h3>
          <button className="text-red-500" onClick={closeModal}>
            Close
          </button>
        </div>
        <pre
          className="p-2 border border-gray-600 rounded bg-gray-800 text-white whitespace-pre-wrap max-h-80 overflow-y-auto"
          style={{ maxHeight: "600px" }}
        >
          {code}
        </pre>
        <div className="flex justify-end mt-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            onClick={handleCopy}
          >
            Copy Code
          </button>
        </div>
        {copied && (
          <div className="text-green-500 mt-1">Copied to clipboard!</div>
        )}
      </div>
    </div>
  );
};

export default CodeModal;
