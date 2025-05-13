// src/components/LoadingSpinner.tsx
import React from "react";
import "../index.css";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingSpinner;
