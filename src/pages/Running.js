import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import JobCard from "../components/JobCard";
import { toast } from "react-toastify";

function Running() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const active = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(job => job.status?.toLowerCase() === "running");
      setJobs(active);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleComplete = async (jobId) => {
    try {
      const jobRef = doc(db, "jobs", jobId);
      await updateDoc(jobRef, { status: "Completed" });
      toast.success("Job completed successfully.");
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "var(--primary)" }}>
      <div className="brand-font" style={{ fontSize: "1.5rem" }}>Loading Running Jobs...</div>
    </div>
  );

  return (
    <div className="page-entry" style={{ padding: "140px 40px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "60px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 900, color: "#fff", marginBottom: "16px", letterSpacing: "-0.04em" }}>
          Running <span style={{ color: "var(--warning)", textShadow: "0 0 30px var(--warning-glow)" }}>Jobs</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", fontWeight: 500 }}>Track and manage your ongoing print jobs</p>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        {jobs.length > 0 ? (
          jobs.map(job => (
            <JobCard key={job.id} job={job} onDelete={(id) => setJobs(jobs.filter(j => j.id !== id))}>
              <button 
                onClick={() => handleComplete(job.id)}
                className="btn-premium"
                style={{ 
                  backgroundColor: "var(--success)", 
                  boxShadow: "0 0 20px var(--success-glow)"
                }}
              >
                <span>✅</span> COMPLETE JOB
              </button>
            </JobCard>
          ))
        ) : (
          <div className="glass-card" style={{ padding: "120px", textAlign: "center", border: "1.5px dashed var(--border)" }}>
            <p style={{ fontSize: "1.6rem", color: "var(--text-muted)", fontWeight: 600 }}>No running jobs found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Running;
