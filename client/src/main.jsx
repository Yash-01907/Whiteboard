import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.jsx";
import  Whiteboard  from "./components/Whiteboard";
import  About  from "./components/About";
import  AuthLayout  from "./components/AuthLayout";
import  Login  from "./components/Login";
import  Register  from "./components/Register";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Whiteboard />} />
      
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  </BrowserRouter>
  // <App />
);
