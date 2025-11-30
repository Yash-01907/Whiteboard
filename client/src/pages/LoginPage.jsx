import Input from "../components/Input";
import { useForm, FormProvider } from "react-hook-form";
import { Link, useLocation } from "react-router";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios.js";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const methods = useForm({
    defaultValues: { "username or email": "", password: "" },
  });
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const from = location.state?.from?.pathname || "/dashboard";
  console.log(location);
  console.log(from);
  const onSubmit = async (data) => {
    try {
      // const userInfo = await fetch("http://localhost:8000/api/v1/users/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     usernameOrEmail: data["username or email"],
      //     password: data.password,
      //   }),
      //   credentials: "include",
      // });
      // const responseData = await userInfo.json();

      const userInfo = await api.post("/users/login", {
        usernameOrEmail: data["username or email"],
        password: data.password,
      });
      const responseData = userInfo.data;
      console.log(responseData);
      if (responseData.success) {
        console.log("Login successful");
        setError(null);
        console.log(responseData.user);
        login(responseData.user);
        navigate(from, { replace: true });
      } else {
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed Login";
      setError(message);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">
            Welcome Back
          </h1>
          <p className="text-[#1A1A1A]">
            Enter your credentials to access your account
          </p>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input
              name="username or email"
              placeholder="Enter your username or email"
              label="Username or Email"
              rules={{ required: "Username or email is required" }}
            />

            <Input
              name="password"
              placeholder="Enter your password"
              label="Password"
              rules={{ required: "Password is required" }}
            />

            {/* Assuming there might be a password field later, but for now just username as per existing code */}
            <button
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md shadow-blue-200 transition-all duration-200 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
            >
              Sign In
            </button>
            <div className="relative">
              {error && (
                <div className="bg-red-100 text-red-700 text-sm font-medium p-3 rounded-md w-full">
                  {error}
                  <button
                    onClick={() => setError(null)}
                    className="absolute right-2 top-1 text-red-700 font-bold hover:text-red-900 text-2xl cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
      <div className="relative flex py-1 items-center mb-6">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">
          Or
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      <div className="flex flex-col gap-6">

      <GoogleLoginButton />

      <div className="text-center text-sm text-[#1A1A1A]">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
          Create account
        </Link>
      </div>
          </div>
    </>
  );
}

export default Login;
