import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 1. Import the Provider
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* 2. Wrap your App */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);
