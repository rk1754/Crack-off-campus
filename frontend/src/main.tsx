import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

// Use strict mode for development and remove it for production
const isProduction = import.meta.env.PROD;

const app = isProduction ? (
  <App />
) : (
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

createRoot(document.getElementById("root")!).render(app);
