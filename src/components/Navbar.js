import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

function Navbar() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    upcoming: 0,
    running: 0,
    completed: 0
  });

  useEffect(() => {
    // Listen to live database changes globally for the navbar
    const unsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
      let pending = 0, upcoming = 0, running = 0, completed = 0;
      
      snapshot.forEach((doc) => {
        const status = doc.data().status;
        if (!status) pending++; // Default to pending if missing
        else if (status.toLowerCase() === "pending") pending++;
        else if (status.toLowerCase() === "upcoming") upcoming++;
        else if (status.toLowerCase() === "running") running++;
        else if (status.toLowerCase() === "completed") completed++;
      });

      setCounts({
        all: snapshot.size,
        pending,
        upcoming,
        running,
        completed
      });
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#00d2ff" : "white",
    textDecoration: "none",
    fontWeight: isActive ? "bold" : "normal",
    borderBottom: isActive ? "2px solid #00d2ff" : "none",
    paddingBottom: "2px"
  });

  return (
    <nav style={{ padding: "15px", backgroundColor: "#333", color: "white", display: "flex", gap: "20px", alignItems: "center" }}>
      <NavLink to="/" style={navLinkStyle}>
        All Jobs ({counts.all})
      </NavLink>
      <NavLink to="/add-job" style={navLinkStyle}>Add Job</NavLink>
      <NavLink to="/pending" style={navLinkStyle}>
        Pending ({counts.pending})
      </NavLink>
      <NavLink to="/upcoming" style={navLinkStyle}>
        Upcoming ({counts.upcoming})
      </NavLink>
      <NavLink to="/running" style={navLinkStyle}>
        Running ({counts.running})
      </NavLink>
      <NavLink to="/completed" style={navLinkStyle}>
        Completed ({counts.completed})
      </NavLink>

      <button 
        onClick={handleLogout} 
        style={{ 
          marginLeft: "auto", 
          padding: "6px 12px", 
          backgroundColor: "#dc3545", 
          color: "white", 
          border: "none", 
          borderRadius: "4px", 
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
