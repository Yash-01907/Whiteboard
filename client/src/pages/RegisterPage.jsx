import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Input from "../components/Input";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useNavigate, Link } from "react-router"; // Added Link
import { useAuth } from "../context/AuthContext";
import { registerUserApi } from "../api/auth"; // Import the API helper

function RegisterPage() {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: { username: "", password: "", email: "" },
  });
  
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      // Use the API helper (Cleaner than raw fetch)
      const responseData = await registerUserApi({
        username: data.username,
        email: data.email,
        password: data.password
      });

      if (responseData.success) {
        login(responseData.user); // Update Context
        navigate("/dashboard");
      }
    } catch (err) {
      // Axios puts the backend error message inside err.response.data
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        {/* FIX: Changed text-white to text-gray-900 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-500 text-sm">
          Join to start collaborating today
        </p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            name="username"
            placeholder="Enter your username"
            label="Username"
            rules={{ required: "Username is required" }}
          />

          <Input
            name="email"
            placeholder="Enter your email"
            label="Email"
            rules={{ 
                required: "Email is required",
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                }
            }}
          />

          <Input
            name="password"
            placeholder="Enter your password"
            label="Password"
            type="password"
            rules={{ 
                required: "Password is required",
                minLength: { value: 6, message: "Must be at least 6 chars" } 
            }}
          />

          <button
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md shadow-blue-200 transition-all duration-200 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {error && (
            <div className="relative bg-red-50 text-red-600 text-sm font-medium p-3 rounded-lg w-full border border-red-100 flex justify-between items-center">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-800 font-bold px-2"
              >
                ×
              </button>
            </div>
          )}
        </form>
      </FormProvider>
      
      {/* Divider */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <GoogleLoginButton />

      <p className="text-center text-sm text-gray-500 mt-2">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;