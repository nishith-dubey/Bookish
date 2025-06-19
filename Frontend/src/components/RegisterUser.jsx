import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const apiBaseUrl = "http://localhost:8000";
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClasses = "w-full p-3 bg-white border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium";
  const buttonClasses = "border-2 border-black w-full px-6 py-3 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all disabled:bg-zinc-400 disabled:shadow-none disabled:cursor-not-allowed";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const endpoint = isLogin ? "/users/login" : "/users/register";
    try {
      const { data } = await axios.post(`${apiBaseUrl}${endpoint}`, form);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen pt-24 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000]">
        <h2 className="text-3xl font-black text-black mb-6 text-center">
          {isLogin ? "Welcome Back!" : "Create Account"}
        </h2>

        {error && <div className="bg-red-400 border-2 border-black text-black font-bold p-3 mb-4 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="font-bold text-sm block mb-1">Username</label>
              <input type="text" name="username" placeholder="Your Username" value={form.username} onChange={handleChange} required className={inputClasses} />
            </div>
          )}

          <div>
            <label className="font-bold text-sm block mb-1">Email</label>
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required className={inputClasses} />
          </div>

          <div>
            <label className="font-bold text-sm block mb-1">Password</label>
            <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required className={inputClasses} />
          </div>

          <button type="submit" disabled={loading} className={`${buttonClasses} bg-blue-400 hover:bg-blue-500`}>
            {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); }} className="font-bold text-black underline hover:text-blue-600">
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;