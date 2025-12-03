import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router"; // Standard import
import { api } from "../api/axios"; // <--- Import your configured Axios instance

const GoogleLoginButton = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginToApp = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await api.post("/auth/google", {
            token: tokenResponse.access_token 
        });
        const data = response.data;

        if (data.success) {
          login(data.user);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Google Login Error:", error);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <button
      onClick={() => loginToApp()}
      className="bg-[#1A1A1A] w-full rounded-xl py-3 px-6 text-white font-semibold flex items-center justify-center cursor-pointer gap-2 hover:bg-black transition-colors shadow-lg active:scale-95 duration-200"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
        alt="Google logo"
        className="w-5 h-5"
      />
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;