"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../config";

const SignUp = ({ setUser }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !phone) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      toast.success("Account created successfully!");

      // If backend returns user data/token, auto-login
      if (data.email) {
        localStorage.setItem("user", JSON.stringify(data));
        if (setUser) setUser(data);
        navigate('/');
      } else {
        navigate('/login');
      }

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative w-full h-full">
      {/* Centered glass card */}
      <div className="relative z-10 w-full max-w-sm rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-xl p-8 flex flex-col items-center shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)]">

        {/* Glow effect behind logo */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-orange-500/20 blur-2xl rounded-full" />

        {/* Logo */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 mb-8 shadow-inner">
          <img src="/read.png" alt="Libra.co Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-instrument-serif text-white mb-2 text-center tracking-wide">
          Join Libra.co
        </h2>
        <p className="text-white/40 text-sm mb-8 font-sans">
          Start buying & selling books today
        </p>

        {/* Form */}
        <div className="flex flex-col w-full gap-5">
          <div className="w-full flex flex-col gap-4">
            <div className="group relative">
              <input
                placeholder="Full Name"
                type="text"
                value={fullName}
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:bg-white/10 focus:border-orange-500/50 transition-all font-sans"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="group relative">
              <input
                placeholder="Email address"
                type="email"
                value={email}
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:bg-white/10 focus:border-orange-500/50 transition-all font-sans"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="group relative">
              <input
                placeholder="Phone Number"
                type="tel"
                value={phone}
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:bg-white/10 focus:border-orange-500/50 transition-all font-sans"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="group relative">
              <input
                placeholder="Password"
                type="password"
                value={password}
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:bg-white/10 focus:border-orange-500/50 transition-all font-sans"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-medium px-5 py-4 rounded-xl shadow-lg shadow-orange-900/20 hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-0.5 mt-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="w-full text-center mt-4">
            <span className="text-sm text-white/40 font-sans">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-400 hover:text-orange-300 transition-colors font-medium ml-1"
              >
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SignUp };
