import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@fontsource/inter";
import "@fontsource/manrope";
import "./styles/theme.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <AuthProvider>

      <Toaster
        position="top-right"
      />

      <App />

    </AuthProvider>

  </React.StrictMode>
);