import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const ref = doc(db, "jobs", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setJob(snap.data());
        } else {
          toast.error("Error: Job not found.");
        }
      } catch (error) {
        toast.error("Error fetching job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const changeStatus = async (status) => {
    try {
      const ref = doc(db, "jobs", id);
      await updateDoc(ref, { status });
      setJob({ ...job, status });
      toast.success(`Status updated to: ${status}`);
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "var(--primary)" }}>
      <div className="brand-font" style={{ fontSize: "1.5rem" }}>Loading Job Details...</div>
    </div>
  );

  if (!job) return (
    <div className="page-entry" style={{ padding: "140px 20px", textAlign: "center" }}>
      <h2 style={{ color: "var(--text-muted)" }}>Job Not Found.</h2>
      <Link to="/" style={{ color: "var(--primary)", fontWeight: 800 }}>← RETURN TO ALL JOBS</Link>
    </div>
  );

  return (
    <div className="page-entry" style={{ padding: "140px 40px 60px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "60px" }}>
        <div>
          <h1 style={{ fontSize: "4rem", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.05em" }}>{job.jobNumber}</h1>
          <p style={{ color: "var(--primary)", fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.1em", marginTop: "10px" }}>{job.clientCompanyName?.toUpperCase() || "INDEPENDENT ENTITY"}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.2em" }}>Current Status</label>
          <select 
            value={job.status || "Pending"} 
            onChange={(e) => changeStatus(e.target.value)}
            style={{ 
              background: "var(--bg-graphite)", 
              fontWeight: 900, 
              color: "#fff",
              border: "1.5px solid var(--primary)",
              padding: "12px 24px",
              borderRadius: "16px",
              cursor: "pointer",
              boxShadow: "0 0 20px var(--primary-glow)"
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Running">Running</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 450px", gap: "40px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
            <section className="glass-card" style={{ padding: "40px", background: "rgba(15, 23, 42, 0.4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
                <span style={{ width: "6px", height: "6px", background: "var(--primary)", borderRadius: "50%" }}></span>
                <h4 style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em" }}>Client Information</h4>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 900, textTransform: "uppercase" }}>Contact Person</label>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "1.25rem", color: "#fff" }}>{job.clientName}</p>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 900, textTransform: "uppercase" }}>Industry</label>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "1.25rem", color: "#fff" }}>{job.labelIndustry || "General"}</p>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 900, textTransform: "uppercase" }}>Phone/Email</label>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "var(--text-platinum)" }}>{job.clientPhone || "—"}</p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "var(--text-muted)" }}>{job.clientEmail || "—"}</p>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 900, textTransform: "uppercase" }}>Address</label>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem", color: "var(--text-muted)" }}>{job.clientAddress || "Not Logged"}</p>
                </div>
              </div>
            </section>

            <section className="glass-card" style={{ padding: "40px", background: "rgba(15, 23, 42, 0.4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
                <span style={{ width: "6px", height: "6px", background: "var(--accent)", borderRadius: "50%" }}></span>
                <h4 style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em" }}>Job Specifications</h4>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 900, textTransform: "uppercase" }}>Size</label>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "1.25rem", color: "#fff" }}>{job.labelSize}</p>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 900, textTransform: "uppercase" }}>Quantity</label>
                  <p style={{ margin: 0, fontWeight: 900, fontSize: "1.25rem", color: "var(--primary)" }}>{Number(job.quantity).toLocaleString()} UNITS</p>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 900, textTransform: "uppercase" }}>Priority</label>
                  <p style={{ 
                    margin: 0, 
                    fontWeight: 900, 
                    fontSize: "1.1rem",
                    color: job.priority === 'High' ? 'var(--danger)' : job.priority === 'Medium' ? 'var(--warning)' : 'var(--success)' 
                  }}>
                    {job.priority?.toUpperCase() || "STANDARD"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {job.addNotes && (
            <section className="glass-card" style={{ padding: "40px", background: "rgba(15, 23, 42, 0.4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <span style={{ width: "6px", height: "6px", background: "var(--warning)", borderRadius: "50%" }}></span>
                <h4 style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em" }}>Operational Notes</h4>
              </div>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "var(--text-platinum)", lineHeight: "1.8", fontSize: "1.1rem" }}>{job.addNotes}</p>
            </section>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <section className="glass-card" style={{ padding: "32px", textAlign: "center", background: "rgba(2, 6, 23, 0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "24px" }}>
              <span style={{ width: "6px", height: "6px", background: "var(--success)", borderRadius: "50%" }}></span>
              <h4 style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em" }}>Job Image</h4>
            </div>
            {job.imageUrl ? (
              <div style={{ position: "relative", overflow: "hidden", borderRadius: "16px", border: "1.5px solid var(--border)", background: "#000" }}>
                <a href={job.imageUrl} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={job.imageUrl} 
                    alt="Job Preview" 
                    style={{ width: "100%", height: "auto", display: "block", transition: "var(--transition)" }} 
                  />
                </a>
              </div>
            ) : (
              <div style={{ padding: "80px 20px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "2px dashed var(--border)", color: "var(--text-muted)" }}>
                No Image Available
              </div>
            )}
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "20px", letterSpacing: "0.05em", fontWeight: 700 }}>Job Image Attachment</p>
          </section>

          <Link to="/" style={{ textDecoration: "none" }}>
            <button className="btn-premium btn-edit" style={{ width: "100%", justifyContent: "center", padding: "20px" }}>
              ← RETURN TO DASHBOARD
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;