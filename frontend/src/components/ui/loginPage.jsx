"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../config";

const SignIn1 = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      toast.success("Login successful!");

      // Save user to state and localStorage
      localStorage.setItem("user", JSON.stringify(data));
      if (setUser) setUser(data);

      navigate('/');

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
          Welcome Back
        </h2>
        <p className="text-white/40 text-sm mb-8 font-sans">
          Continue your reading journey
        </p>

        {/* Form */}
        <div className="flex flex-col w-full gap-5">
          <div className="w-full flex flex-col gap-4">
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
                placeholder="Password"
                type="password"
                value={password}
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:bg-white/10 focus:border-orange-500/50 transition-all font-sans"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-medium px-5 py-4 rounded-xl shadow-lg shadow-orange-900/20 hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-0.5 mt-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="w-full text-center mt-4">
            <span className="text-sm text-white/40 font-sans">
              New to Libra.co?{" "}
              <Link
                to="/signup"
                className="text-orange-400 hover:text-orange-300 transition-colors font-medium ml-1"
              >
                Create account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SignIn1 };
