import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import AuthLayout from "./components/AuthLayout";
import LoginPage from "./pages/LoginPage";
import Register from "./components/Register";
import WhiteboardWrapper from "./pages/WhiteBoardPage.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import conf from "./utils/conf";
import RegisterPage from "./pages/RegisterPage.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={conf.googleClientId}>
      <Routes>
        <Route index element={<WhiteboardWrapper />} />

        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
