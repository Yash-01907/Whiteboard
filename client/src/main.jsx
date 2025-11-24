import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import  AuthLayout  from "./components/AuthLayout";
import  Login  from "./components/Login";
import  Register  from "./components/Register";
import WhiteboardWrapper from "./pages/WhiteboardWrapper.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<WhiteboardWrapper />} />
      
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
