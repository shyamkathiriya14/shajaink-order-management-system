import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import logo from "../assets/sahajink-logo.png";
import Logout from "../assets/logout-icon.png";

function Navbar() {
  const [counts, setCounts] = useState({
    pending: 0,
    upcoming: 0,
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
        upcoming: allJobs.filter((j) => j.status?.toLowerCase() === "upcoming")
          .length,
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
      <nav className="fixed top-4 md:top-[30px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] md:w-[calc(100%-60px)] max-w-[1500px] z-[1000]">
        <div className="glass-card flex justify-between items-center px-5 md:px-8 py-3 md:py-3.5 rounded-[20px] md:rounded-[24px] bg-[#020619]/80">
          {/* Elite Brand */}
          <Link to="/" className="no-underline flex items-center gap-3 group">
            <div>
              <img
                src={logo}
                alt="Logo"
                className="w-[130px] sm:w-[160px] h-auto"
              />
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white text-2xl focus:outline-none"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden xl:flex gap-2 items-center">
            <NavLink to="/" className={navItemStyle}>
              All Jobs
            </NavLink>
            <NavLink to="/pending" className={navItemStyle}>
              Pending{" "}
              <span className="text-[var(--accent)] [box-shadow:0_0_10px_var(--accent-glow)] px-1.5 py-0.5 rounded-md bg-[var(--accent)]/10 text-[0.7rem]">
                {counts.pending}
              </span>
            </NavLink>
            <NavLink to="/upcoming" className={navItemStyle}>
              Upcoming{" "}
              <span className="text-[var(--primary)] [box-shadow:0_0_10px_var(--primary-glow)] px-1.5 py-0.5 rounded-md bg-[var(--primary)]/10 text-[0.7rem]">
                {counts.upcoming}
              </span>
            </NavLink>
            <NavLink to="/running" className={navItemStyle}>
              Running{" "}
              <span className="text-[var(--warning)] [box-shadow:0_0_10px_var(--warning-glow)] px-1.5 py-0.5 rounded-md bg-[var(--warning)]/10 text-[0.7rem]">
                {counts.running}
              </span>
            </NavLink>
            <NavLink to="/completed" className={navItemStyle}>
              Completed{" "}
              <span className="text-[var(--success)] [box-shadow:0_0_10px_var(--success-glow)] px-1.5 py-0.5 rounded-md bg-[var(--success)]/10 text-[0.7rem]">
                {counts.completed}
              </span>
            </NavLink>

            <div className="w-[1.5px] h-[30px] bg-[var(--border)] mx-3"></div>

            <Link to="/add-job" className="no-underline">
              <button className="btn-primary px-5 py-2.5 text-[12px] rounded-[12px]">
                + ADD JOB
              </button>
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2.5 bg-[#ef4444]/5 text-[var(--danger)] rounded-[12px] border-[1.5px] border-[#ef4444]/10 ml-1 cursor-pointer transition-all duration-300 hover:bg-[#ef4444]/10"
              title="Logout"
            >
              <span className="text-lg">
                <img src={Logout} alt="Logout" className="w-[20px] h-[20px]" />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Sidebar / Drawer */}
        <div
          className={`xl:hidden absolute top-[85px] sm:top-[100px] left-0 w-full transition-all duration-500 transform ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"}`}
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
              Pending Jobs ({counts.pending})
            </NavLink>
            <NavLink
              to="/upcoming"
              className={navItemStyle}
              onClick={() => setIsMenuOpen(false)}
            >
              Upcoming Jobs ({counts.upcoming})
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
              Completed Jobs ({counts.completed})
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
              className="w-full p-4 bg-[#ef4444]/10 text-[var(--danger)] rounded-[14px] border-[1.5px] border-[#ef4444]/20 font-bold flex items-center justify-center gap-2 mt-2"
            >
              <span className="text-xl">
                {" "}
                <img src={Logout} alt="Logout" className="w-[18px] h-auto" />
              </span>{" "}
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 w-full h-full bg-[#0206172e] z-[9999] flex items-center justify-center backdrop-blur-md p-4">
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
