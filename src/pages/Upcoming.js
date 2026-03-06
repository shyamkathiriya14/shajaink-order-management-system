import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import JobCard from "../components/JobCard";
import { toast } from "react-toastify";

function Upcoming() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, "jobs"));
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(job => job.status && job.status.toLowerCase() === "upcoming");

      setJobs(data);
    };

    fetchJobs();
  }, []);

  const handleStart = async (jobId) => {
    try {
      const jobRef = doc(db, "jobs", jobId);
      await updateDoc(jobRef, { status: "Running" });
      setJobs(jobs.filter(job => job.id !== jobId));
      toast.success("Job moved to Running!");
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update status!");
    }
  };

  const handleDelete = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  return (
    <div className="page-entry" style={{ padding: "140px 40px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "60px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 900, color: "#fff", marginBottom: "16px", letterSpacing: "-0.04em" }}>
          Upcoming <span style={{ color: "var(--primary)", textShadow: "0 0 30px var(--primary-glow)" }}>Jobs</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", fontWeight: 500 }}>Scheduled orders ready for production</p>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        {jobs.length === 0 ? (
          <div className="glass-card" style={{ padding: "120px", textAlign: "center", border: "1.5px dashed var(--border)" }}>
            <p style={{ fontSize: "1.6rem", color: "var(--text-muted)", fontWeight: 600 }}>No upcoming jobs found</p>
          </div>
        ) : (
          jobs.map(job => (
            <JobCard key={job.id} job={job} onDelete={handleDelete}>
              <button 
                onClick={() => handleStart(job.id)}
                className="btn-premium"
                style={{ 
                  backgroundColor: "var(--primary)", 
                  boxShadow: "0 0 20px var(--primary-glow)"
                }}
              >
                <span>⚡</span> START PRINTING
              </button>
            </JobCard>
          ))
        )}
      </div>
    </div>
  );
}

export default Upcoming;
