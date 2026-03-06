import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import JobCard from "../components/JobCard";

function Completed() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const archived = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(job => job.status?.toLowerCase() === "completed");
      setJobs(archived);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "var(--primary)" }}>
      <div className="brand-font" style={{ fontSize: "1.5rem" }}>Loading Completed Jobs...</div>
    </div>
  );

  return (
    <div className="page-entry" style={{ padding: "140px 40px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "60px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 900, color: "#fff", marginBottom: "16px", letterSpacing: "-0.04em" }}>
          Completed <span style={{ color: "var(--success)", textShadow: "0 0 30px var(--success-glow)" }}>Jobs</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", fontWeight: 500 }}>A record of all finalized print jobs</p>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        {jobs.length > 0 ? (
          jobs.map(job => (
            <JobCard key={job.id} job={job} onDelete={(id) => setJobs(jobs.filter(j => j.id !== id))} />
          ))
        ) : (
          <div className="glass-card" style={{ padding: "120px", textAlign: "center", border: "1.5px dashed var(--border)" }}>
            <p style={{ fontSize: "1.6rem", color: "var(--text-muted)", fontWeight: 600 }}>No completed jobs found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Completed;
