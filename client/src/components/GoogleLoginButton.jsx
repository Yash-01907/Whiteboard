import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      // tokenResponse contains "access_token", NOT "credential" (ID Token)

      // Send the access token to backend

      try {
        const userInfo = await fetch("http://localhost:8000/api/v1/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
          credentials: "include",
        });
        const data = await userInfo.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    // You can style this button however you want!
    <button
      onClick={() => login()}
      className="bg-[#1A1A1A] w-full rounded-xl py-3 px-6 text-white font-semibold flex items-center justify-center cursor-pointer gap-2"
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
