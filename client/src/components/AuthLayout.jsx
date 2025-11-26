import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
