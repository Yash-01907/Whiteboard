import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import AuthLayout from "./components/AuthLayout";
import LoginPage from "./pages/LoginPage";
import WhiteboardPage from "./pages/WhiteBoardPage.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import conf from "./utils/conf";
import RegisterPage from "./pages/RegisterPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={conf.googleClientId}>
      <AuthProvider>
        <Routes>
          <Route path="/board/demo" element={<WhiteboardPage />} />
          <Route
            path="board/:id"
            element={
              <RequireAuth>
                <WhiteboardPage />
              </RequireAuth>
            }
          />
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route
            path="dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
