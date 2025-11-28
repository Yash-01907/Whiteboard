import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

// 1. Create the Context (The "Signal")
const AuthContext = createContext();

// 2. Create the Provider (The "Router" that broadcasts the signal)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  // This runs ONCE when the app starts
  useEffect(() => {
    const verifyUser = async () => {
      try {
        // We ask the backend: "Who is the current user?"
        // Make sure this URL matches your backend route!
        const res = await axios.get(
          "http://localhost:8000/api/v1/users/current-user",
          {
            withCredentials: true, // IMPORTANT: Sends the cookie
          }
        );
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        // If error (401), it just means we aren't logged in. That's fine.
     
        setUser(null);
        navigate("/login");
      } finally {
        setLoading(false); // We are done checking
      }
    };

    verifyUser();
  }, []);

  // Helper function to update user manually (e.g., after Login)
  const login = (userData) => {
    setUser(userData);
  };

  // Helper function to clear user (e.g., Logout)
  const logout = () => {
    setUser(null);
    // You can also call a backend logout endpoint here if you want
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {/* "children" is your entire App, which sits inside this provider */}
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create the Custom Hook (The "Receiver")
// This makes it easy to use in other files: const { user } = useAuth();
export const useAuth = () => useContext(AuthContext);
