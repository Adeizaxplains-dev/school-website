import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/lora";
import "@fontsource-variable/figtree";
import "./index.css";
import App from "./App.jsx";
import { applyTheme } from "./utils/theme.js";
import { AuthProvider } from "./context/AuthContext.jsx";

// Apply the colours, fonts and radius from theme.config.js before the first render
applyTheme();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
