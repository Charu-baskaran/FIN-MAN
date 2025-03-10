import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

function Login() {
  const { Login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    // login({ email: e.target.email.value });
    const email = e.target.email.value;
    const password = e.target.password.value;
    const success = await Login(email, password);
    if (success) navigate("/Dashboard")
    };
  

  return (
    <motion.div
      className="auth-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="auth-container">
        {/* Centered Welcome Text */}
        <h2 className="auth-welcome">Welcome to Finance Manager App</h2>

        {/* Inner Content (GIF + Form) */}
        <div className="auth-content">
          {/* Left Side (GIF) */}
          <div className="auth-left">
            <img
              src="/animations/login Animation.gif"
              alt="Login illustration"
              className="auth-gif"
            />
          </div>

          {/* Right Side (Login Form) */}
          <div className="auth-right">
            <div className="auth-form">
              <h3 className="text-center">Sign In</h3>
              <p className="text-center">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input name="email" type="email" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input name="password" type="password" className="form-control" required />
                </div>
                <button className="btn btn-primary w-100">Sign In</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;