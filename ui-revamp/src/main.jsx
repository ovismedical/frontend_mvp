import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ScaleProvider } from "./context/ScaleContext";
import "./styles/index.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScaleProvider>
          <App />
        </ScaleProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
