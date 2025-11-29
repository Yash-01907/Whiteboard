import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import Input from '../components/Input'
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useState } from 'react';
import { useNavigate } from 'react-router';
function RegisterPage() {
    const navigate = useNavigate();
    const methods = useForm({
        defaultValues: { username: "", password: "", email: "" },
    });

    const [error, setError] = useState(null);
    const onSubmit = async (data) => {
        try {
            const userInfo = await fetch("http://localhost:8000/api/v1/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: data.username, password: data.password, email: data.email }),
                credentials: "include",
            });
            const responseData = await userInfo.json();
            if (responseData.success) {
                navigate("/dashboard");
                setError(null);
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
            <h1 className="text-3xl font-bold text-white mb-2">Register</h1>
            <p className="text-gray-400">
                Create an account to start using Whiteboard
            </p>
        </div>

        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                    rules={{ required: "Email is required",}}
                />

                <Input
                    name="password"
                    placeholder="Enter your password"
                    label="Password"
                    type="password"
                    rules={{ required: "Password is required",  }}
                />

                <button
                    className="mt-2 w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    type="submit"
                >
                    Register
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
    </div>
  )
}

export default RegisterPage