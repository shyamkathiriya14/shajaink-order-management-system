import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

function Navbar() {
  const [counts, setCounts] = useState({
    pending: 0,
    running: 0,
    completed: 0,
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const allJobs = snapshot.docs.map((doc) => doc.data());
      setCounts({
        pending: allJobs.filter(
          (j) => j.status?.toLowerCase() === "pending" || !j.status,
        ).length,
        running: allJobs.filter((j) => j.status?.toLowerCase() === "running")
          .length,
        completed: allJobs.filter(
          (j) => j.status?.toLowerCase() === "completed",
        ).length,
      });
    });
    return () => unsubscribe();
  }, []);

  // Body Scroll Lock for Modal
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showLogoutModal]);

  const confirmLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Body Scroll Lock for Menu/Modal
  useEffect(() => {
    if (showLogoutModal || isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showLogoutModal, isMenuOpen]);

  const navItemStyle = ({ isActive }) => `
    no-underline text-sm md:text-xs font-extrabold uppercase tracking-widest px-5 py-3 md:py-2.5 rounded-[14px] transition-all duration-300 flex items-center gap-2.5 w-full md:w-auto
    ${isActive ? "text-white bg-white/5 border-[1.5px] border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]" : "text-[var(--text-muted)] bg-transparent border-[1.5px] border-transparent hover:text-white"}
  `;

  return (
    <>
      <nav className="fixed top-4 md:top-[30px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] md:w-[calc(100%-60px)] max-w-[1380px] z-[1000]">
        <div className="glass-card flex justify-between items-center px-5 md:px-8 py-3 md:py-3.5 rounded-[20px] md:rounded-[24px] bg-[#020619]/80">
          {/* Elite Brand */}
          <Link to="/" className="no-underline flex items-center gap-3 group">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-[10px] flex items-center justify-center font-black text-white text-lg md:text-xl shadow-[0_0_20px_var(--primary-glow)] group-hover:scale-110 transition-transform">
              S
            </div>
            <span className="text-base md:text-lg font-extrabold tracking-[0.15em] text-white [text-shadow:0_0_15px_rgba(255,255,255,0.2)]">
              SAHAJINK
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white text-2xl focus:outline-none"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-2 items-center">
            <NavLink to="/" className={navItemStyle}>
              All Jobs
            </NavLink>
            <NavLink to="/pending" className={navItemStyle}>
              Pending
            </NavLink>
            <NavLink to="/upcoming" className={navItemStyle}>
              Upcoming
            </NavLink>
            <NavLink to="/running" className={navItemStyle}>
              Running{" "}
              <span className="text-[var(--warning)] [box-shadow:0_0_10px_var(--warning-glow)] px-1.5 py-0.5 rounded-md bg-[var(--warning)]/10 text-[0.7rem]">
                {counts.running}
              </span>
            </NavLink>
            <NavLink to="/completed" className={navItemStyle}>
              Completed
            </NavLink>

            <div className="w-[1.5px] h-[30px] bg-[var(--border)] mx-3"></div>

            <Link to="/add-job" className="no-underline">
              <button className="btn-primary px-5 py-2.5 text-[0.7rem] rounded-[12px]">
                + ADD JOB
              </button>
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2.5 bg-[#ef4444]/5 text-[var(--danger)] rounded-[12px] border-[1.5px] border-[#ef4444]/10 ml-1 cursor-pointer transition-all duration-300 hover:bg-[#ef4444]/10"
              title="Logout"
            >
              <span className="text-lg">⏻</span>
            </button>
          </div>
        </div>

        {/* Mobile Sidebar / Drawer */}
        <div
          className={`md:hidden absolute top-[70px] left-0 w-full transition-all duration-500 transform ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"}`}
        >
          <div className="glass-card p-6 bg-[#020619]/95 flex flex-col gap-3">
            <NavLink
              to="/"
              className={navItemStyle}
              onClick={() => setIsMenuOpen(false)}
            >
              All Jobs
            </NavLink>
            <NavLink
              to="/pending"
              className={navItemStyle}
              onClick={() => setIsMenuOpen(false)}
            >
              Pending Jobs
            </NavLink>
            <NavLink
              to="/upcoming"
              className={navItemStyle}
              onClick={() => setIsMenuOpen(false)}
            >
              Upcoming Jobs
            </NavLink>
            <NavLink
              to="/running"
              className={navItemStyle}
              onClick={() => setIsMenuOpen(false)}
            >
              Running Jobs ({counts.running})
            </NavLink>
            <NavLink
              to="/completed"
              className={navItemStyle}
              onClick={() => setIsMenuOpen(false)}
            >
              Completed Jobs
            </NavLink>

            <div className="h-[1px] w-full bg-[var(--border)] my-2"></div>

            <Link
              to="/add-job"
              className="no-underline"
              onClick={() => setIsMenuOpen(false)}
            >
              <button className="btn-primary w-full py-4 rounded-[14px] text-sm flex items-center justify-center gap-2">
                <span>+</span> CREATE NEW JOB
              </button>
            </Link>

            <button
              onClick={() => {
                setShowLogoutModal(true);
                setIsMenuOpen(false);
              }}
              className="w-full p-4 bg-[#ef4444]/10 text-[var(--danger)] rounded-[14px] border-[1.5px] border-[#ef4444]/20 font-bold flex items-center justify-center gap-3 mt-2"
            >
              <span className="text-xl">⏻</span> AUTHORIZE LOGOUT
            </button>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 w-full h-full bg-[#020617]/90 z-[9999] flex items-center justify-center backdrop-blur-xl p-4">
          <div className="glass-card max-w-[400px] w-full p-8 md:p-10 text-center animate-fade-in-up">
            <h2 className="text-[var(--danger)] mb-4 text-2xl md:text-3xl font-bold">
              Logout Confirmation?
            </h2>
            <p className="text-[var(--text-muted)] mb-8 text-sm md:text-base font-medium">
              Are you sure you want to log out of the system?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 p-4 bg-transparent border-[1.5px] border-[var(--border)] text-white rounded-[14px] font-bold cursor-pointer hover:bg-white/5 transition-all text-xs md:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 p-4 rounded-[14px] bg-[var(--danger)] border-none shadow-[0_10px_20px_rgba(239,68,68,0.2)] font-bold text-white text-xs md:text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
