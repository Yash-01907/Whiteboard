import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center p-10">Checking your credentials...</div>;
  }

  if (!user) {
    // Redirect to login, but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;