import { Outlet } from "react-router"; // or "react-router-dom" depending on your version
import { useNavigate } from "react-router"; // or "react-router-dom"

const AuthLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-900 relative overflow-hidden">
      
      {/* Optional Background Pattern for Polish */}
      <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]"></div>

      <button
        type="button"
        onClick={() => navigate("/board/demo")}
        className="absolute top-6 right-6 px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:shadow-md transition-all font-medium text-sm z-10"
      >
        Try Guest Mode &rarr;
      </button>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-2xl shadow-xl relative z-10">
        <Outlet />
      </div>
      
    </div>
  );
};

export default AuthLayout;