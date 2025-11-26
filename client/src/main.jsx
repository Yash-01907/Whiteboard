import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import  AuthLayout  from "./components/AuthLayout";
import  LoginPage  from "./pages/LoginPage";
import  Register  from "./components/Register";
import WhiteboardWrapper from "./pages/WhiteBoardPage.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<WhiteboardWrapper />} />
      
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
