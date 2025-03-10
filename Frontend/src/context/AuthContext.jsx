import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigate

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from sessionStorage on page refresh
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate(); // Move useNavigate inside AuthProvider

  const Login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        sessionStorage.setItem("user", JSON.stringify(data.user)); // Store user session
        navigate("/Dashboard"); // Navigate to dashboard after successful login
        return true; // Indicate success
      } else {
        alert(data.message);
        return false; // Indicate failure
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Try again later.");
      return false;
    }
  };

  const Signup = async (name, email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/signup`, {  // Fixed API route case
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem("user", JSON.stringify(data.user));  // Store full user object
        sessionStorage.setItem("userId", data.user._id);            // Store userId separately
        navigate("/Dashboard"); // Navigate after signup
        return true;
      } else {
        alert(data.message);
        return false;
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Something went wrong. Try again later.");
      return false;
    }
  };
  

  const logout = () => {
        setUser(null);
        navigate("/"); // navigate back to Login
      };

  return (
    <AuthContext.Provider value={{ user, Login, Signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);