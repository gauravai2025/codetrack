import React, { useState, useEffect } from "react";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTransparent, setIsTransparent] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTransparency = () => {
    setIsTransparent(!isTransparent);
  };

  const clockStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: isTransparent ? "rgba(255, 255, 255, 0)" : "#333",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={clockStyle} onClick={toggleTransparency}>
      {currentTime.toLocaleTimeString()}
    </div>
  );
};

export default Clock;
