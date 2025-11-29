import Input from "../components/Input";
import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios.js";

function Login() {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: { "username or email": "", password: "" },
  });
  const { login } = useAuth();
  const [error, setError] = useState(null);
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

      const userInfo=await api.post("/users/login", {
        usernameOrEmail: data["username or email"],
        password: data.password,
      });
      const responseData = userInfo.data;
      if (responseData.success) {
        console.log("Login successful");
        setError(null);
        console.log(responseData.user)
        login(responseData.user);
        navigate("/dashboard");
      } else {
        setError(responseData.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400">
          Enter your credentials to access your account
        </p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mb-10"
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
            className="mt-2 w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            type="submit"
          >
            Sign In
          </button>
          {error && (
            <div className="relative bg-red-100 text-red-700 text-sm font-medium mt-2 p-3 rounded-md w-full">
              {error}

              <button
                onClick={() => setError(null)}
                className="absolute right-2 top-1 text-red-700 font-bold hover:text-red-900 text-2xl cursor-pointer"
              >
                ×
              </button>
            </div>
          )}
        </form>
      </FormProvider>

      <GoogleLoginButton />

      <div className="text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}

export default Login;
