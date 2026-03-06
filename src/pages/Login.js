import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/sahajink-logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "sahaj@8485") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isAdmin", "true");
      toast.success("Welcome Admin, Logged in Successfully");
      navigate("/");
    } else {
      toast.error("Access Denied: Invalid Credentials.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden px-4">
      {/* Background Mesh Animation */}
      <div className="mesh-gradient opacity-30 md:opacity-40"></div>

      <div className="glass-card w-full max-w-[450px] p-8 md:p-15 rounded-[32px] relative z-10 animate-fade-in-up">
        <div className="flex items-center justify-center mb-6 md:mb-8">
          <img
            src={logo}
            alt="Logo"
            className="w-[200px] sm:w-[250px] h-auto"
          />
          {/* <p className="text-[var(--text-muted)] text-sm md:text-base font-bold tracking-[0.2em] uppercase opacity-60">
            Control Nexus
          </p> */}
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-2.5">
            <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 md:p-5 rounded-xl md:rounded-2xl focus:border-[var(--primary)] outline-none transition-all font-bold placeholder:text-[var(--text-muted)]/20 shadow-inner"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 md:p-5 rounded-xl md:rounded-2xl focus:border-[var(--primary)] outline-none transition-all font-bold placeholder:text-[var(--text-muted)]/20 shadow-inner tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-5 md:py-6 text-base md:text-lg font-black uppercase tracking-[0.25em] shadow-[0_20px_50px_rgba(0,112,255,0.3)] mt-4 md:mt-6 group relative overflow-hidden"
          >
            <span className="relative z-10 font-black">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </form>

        <div className="mt-10 md:mt-15 text-center">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mb-6"></div>
          <p className="text-[0.6rem] md:text-[0.65rem] text-[var(--text-muted)] font-black uppercase tracking-[0.3em] opacity-40">
            Managed By sahajink PVT LTD
          </p>
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
    </div>
  );
};

export default Login;
