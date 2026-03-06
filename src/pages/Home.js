import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import JobCard from "../components/JobCard";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobs(list);
    });
    return () => unsubscribe();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      (job.jobNumber && job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.clientName && job.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.clientCompanyName && job.clientCompanyName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === "All" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: jobs.length,
    pending: jobs.filter(j => j.status?.toLowerCase() === "pending").length,
    running: jobs.filter(j => j.status?.toLowerCase() === "running").length,
    completed: jobs.filter(j => j.status?.toLowerCase() === "completed").length,
  };

  return (
    <div className="page-entry" style={{ padding: "140px 60px 60px", maxWidth: "1500px", margin: "0 auto" }}>
      {/* Dashboard Summary Widgets */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", marginBottom: "80px" }}>
        {[
          { label: "Total Jobs", value: counts.all, color: "var(--primary)", glow: "var(--primary-glow)", icon: "≣" },
          { label: "Pending", value: counts.pending, color: "var(--accent)", glow: "var(--accent-glow)", icon: "○" },
          { label: "Running", value: counts.running, color: "var(--warning)", glow: "var(--warning-glow)", icon: "◈" },
          { label: "Completed", value: counts.completed, color: "var(--success)", glow: "var(--success-glow)", icon: "●" }
        ].map(stat => (
          <div key={stat.label} className="glass-card" style={{ padding: "40px", borderTop: `4px solid ${stat.color}`, background: "rgba(15, 23, 42, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.15em" }}>{stat.label}</p>
              <h2 style={{ margin: "16px 0 0 0", fontSize: "3rem", color: "#fff", textShadow: `0 0 30px ${stat.glow}`, fontWeight: 800 }}>{stat.value}</h2>
            </div>
            <span style={{ fontSize: "2.5rem", color: stat.color, opacity: 0.3 }}>{stat.icon}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "40px" }}>
        <div>
          <h2 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#fff", marginBottom: "12px", letterSpacing: "-0.04em" }}>All Jobs</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", fontWeight: 500 }}>Track and manage all your print orders</p>
        </div>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search by Job ID or Company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "380px", paddingLeft: "50px", height: "56px", border: "1.5px solid var(--border)" }}
            />
            <span style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", opacity: 0.4, fontSize: "1.2rem" }}>🔍</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: "220px", height: "56px", border: "1.5px solid var(--border)" }}
          >
            <option value="All">All Jobs</option>
            <option value="Pending">Pending</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Running">Running</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div style={{ 
        display: "grid", 
        gap: "16px"
      }}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onDelete={(id) => setJobs(jobs.filter(j => j.id !== id))} />
          ))
        ) : (
          <div className="glass-card" style={{ padding: "120px", textAlign: "center", background: "rgba(15, 23, 42, 0.2)" }}>
            <div style={{ fontSize: "4rem", marginBottom: "24px", opacity: 0.2 }}>∅</div>
            <p style={{ fontSize: "1.6rem", color: "var(--text-muted)", marginBottom: "32px", fontWeight: 600 }}>No jobs found</p>
            <button className="btn-primary" onClick={() => {setSearchTerm(""); setFilterStatus("All")}}>RESET SEARCH</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;