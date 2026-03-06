import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

function Navbar() {
  const [counts, setCounts] = useState({ pending: 0, running: 0, completed: 0 });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const allJobs = snapshot.docs.map(doc => doc.data());
      setCounts({
        pending: allJobs.filter(j => j.status?.toLowerCase() === "pending" || !j.status).length,
        running: allJobs.filter(j => j.status?.toLowerCase() === "running").length,
        completed: allJobs.filter(j => j.status?.toLowerCase() === "completed").length,
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
    return () => { document.body.style.overflow = "unset"; };
  }, [showLogoutModal]);

  const confirmLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const navItemStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? "#fff" : "var(--text-muted)",
    fontSize: "0.8rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    padding: "10px 20px",
    borderRadius: "14px",
    transition: "var(--transition)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: isActive ? "rgba(255, 255, 255, 0.05)" : "transparent",
    border: isActive ? "1.5px solid rgba(255, 255, 255, 0.1)" : "1.5px solid transparent",
    boxShadow: isActive ? "0 10px 30px rgba(0,0,0,0.3)" : "none"
  });

  return (
    <>
      <nav style={{ 
        position: "fixed", 
        top: "30px", 
        left: "50%", 
        transform: "translateX(-50%)", 
        width: "calc(100% - 60px)", 
        maxWidth: "1380px", 
        zIndex: 1000,
      }}>
        <div className="glass-card" style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "14px 32px", 
          borderRadius: "24px",
          background: "rgba(2, 6, 23, 0.8)",
        }}>
          {/* Elite Brand */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ 
              width: "36px", 
              height: "36px", 
              background: "linear-gradient(135deg, var(--primary), var(--accent))", 
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              color: "#fff",
              fontSize: "1.4rem",
              boxShadow: "0 0 20px var(--primary-glow)"
            }}>S</div>
            <span style={{ 
              fontSize: "1.1rem", 
              fontWeight: 800, 
              letterSpacing: "0.15em", 
              color: "#fff",
              textShadow: "0 0 15px rgba(255,255,255,0.2)"
            }}>SAHAJINK</span>
          </Link>

          {/* Executive Command Dashboard Links */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <NavLink to="/" style={navItemStyle}>All Jobs</NavLink>
            <NavLink to="/pending" style={navItemStyle}>Pending Jobs</NavLink>
            <NavLink to="/upcoming" style={navItemStyle}>Upcoming Jobs</NavLink>
            <NavLink to="/running" style={navItemStyle}>
              Running Jobs <span style={{ color: "var(--warning)", boxShadow: "0 0 10px var(--warning-glow)", padding: "2px 6px", borderRadius: "6px", background: "rgba(245, 158, 11, 0.1)", fontSize: "0.7rem" }}>{counts.running}</span>
            </NavLink>
            <NavLink to="/completed" style={navItemStyle}>Completed Jobs</NavLink>
            
            <div style={{ width: "1.5px", height: "30px", background: "var(--border)", margin: "0 15px" }}></div>
            
            <Link to="/add-job" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ padding: "12px 24px", fontSize: "0.75rem", borderRadius: "14px" }}>
                + ADD JOB
              </button>
            </Link>
            
            <button 
              onClick={() => setShowLogoutModal(true)}
              style={{ 
                padding: "12px", 
                background: "rgba(239, 68, 68, 0.05)", 
                color: "var(--danger)", 
                borderRadius: "14px",
                border: "1.5px solid rgba(239, 68, 68, 0.1)",
                marginLeft: "8px",
                cursor: "pointer",
                transition: "var(--transition)"
              }} 
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"} 
              onMouseOut={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)"}
              title="Logout"
            >
              <span style={{ fontSize: "1.2rem" }}>⏻</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%", 
          background: "rgba(2, 6, 23, 0.9)", 
          zIndex: 9999, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          backdropFilter: "blur(20px)" 
        }}>
          <div className="glass-card" style={{ 
            maxWidth: "400px", 
            width: "90%", 
            padding: "40px", 
            textAlign: "center",
            animation: "fade-in-up 0.3s ease" 
          }}>
            <h2 style={{ color: "var(--danger)", marginBottom: "16px", fontSize: "1.8rem" }}>Logout Confirmation?</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "1.05rem" }}>
              Are you sure you want to do logout?
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={() => setShowLogoutModal(false)}
                style={{ 
                  flex: 1, 
                  padding: "16px", 
                  background: "none", 
                  border: "1.5px solid var(--border)", 
                  color: "#fff", 
                  borderRadius: "14px", 
                  fontWeight: 700, 
                  cursor: "pointer",
                  transition: "var(--transition)"
                }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="btn-primary"
                style={{ 
                  flex: 1, 
                  padding: "16px", 
                  borderRadius: "14px",
                  background: "var(--danger)",
                  boxShadow: "0 10px 20px rgba(239, 68, 68, 0.2)"
                }}
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
