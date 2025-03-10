import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

function Signup() {
  const { Signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    // login({ name: e.target.name.value, email: e.target.email.value });
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const success = await Signup(name, email, password);
    if (success) navigate("/Login")
   
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
              src="/animations/Signup Animation.gif"
              alt="Signup illustration"
              className="auth-gif"
            />
          </div>

          {/* Right Side (Signup Form) */}
          <div className="auth-right">
            <div className="auth-form">
              <h3 className="text-center">Sign Up</h3>
              <p className="text-center">
                Already have an account? <Link to="/">Sign In</Link>
              </p>
              <form onSubmit={handleSignup}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input name="name" type="text" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input name="email" type="email" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input name="password" type="password" className="form-control" required />
                </div>
                <button className="btn btn-primary w-100">Sign Up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Signup;