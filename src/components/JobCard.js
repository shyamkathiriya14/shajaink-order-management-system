import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";

function JobCard({ job, onDelete, children }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedJob, setEditedJob] = useState({ ...job });

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "jobs", job.id));
      onDelete(job.id);
      toast.info("Job deleted successfully.");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Error deleting job.");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const { id, ...dataToUpdate } = editedJob;
      await updateDoc(doc(db, "jobs", job.id), dataToUpdate);
      toast.success("Job updated successfully.");
      setShowEditModal(false);
      window.location.reload(); 
    } catch (error) {
      toast.error("Failed to update job.");
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "completed") return <span className="badge badge-success">● COMPLETED</span>;
    if (s === "running") return <span className="badge badge-running">◈ RUNNING</span>;
    return <span className="badge badge-pending">○ PENDING</span>;
  };

  const getPriorityColor = (p) => {
    if (p === "High") return "var(--danger)";
    if (p === "Medium") return "var(--warning)";
    return "var(--success)";
  };

  return (
    <>
      <div className="glass-card page-entry" style={{ padding: "32px", marginBottom: "16px", position: "relative", background: "rgba(15, 23, 42, 0.5)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "32px", alignItems: "start" }}>
          
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1.6rem", color: "#fff", margin: 0, fontWeight: 800 }}>{job.jobNumber}</h3>
              {getStatusBadge(job.status)}
              <span style={{ 
                fontSize: "0.65rem", 
                fontWeight: 900, 
                color: getPriorityColor(job.priority),
                padding: "4px 10px",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${getPriorityColor(job.priority)}`,
                borderRadius: "6px",
                letterSpacing: "0.1em"
              }}>{job.priority?.toUpperCase()} PRIORITY</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr", gap: "40px" }}>
              <div style={{ borderLeft: "3px solid var(--primary)", paddingLeft: "20px" }}>
                <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Client Company</p>
                <p style={{ margin: "6px 0 0 0", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-platinum)" }}>{job.clientCompanyName || "Independent"}</p>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>{job.clientName}</p>
              </div>
              
              <div>
                <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Specifications</p>
                <p style={{ margin: "6px 0 0 0", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-platinum)" }}>{job.labelSize}</p>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.9rem", color: "var(--primary)", fontWeight: 800 }}>{job.quantity?.toLocaleString()} UNITS</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Date</p>
                <p style={{ margin: "6px 0 0 0", fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 600 }}>{new Date(job.createdAt).toLocaleDateString()}</p>
                <Link to={`/job/${job.id}`} style={{ textDecoration: "none", display: "inline-block", marginTop: "12px", fontSize: "0.8rem", color: "var(--primary)", fontWeight: 900, letterSpacing: "0.05em" }}>VIEW DETAILS →</Link>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-end" }}>
            <div className="action-group">
              <button 
                onClick={() => setShowEditModal(true)} 
                className="btn-premium btn-edit"
                title="Edit Job"
              >
                <span>✎</span> EDIT
              </button>
              <button 
                onClick={() => setShowDeleteModal(true)} 
                className="btn-premium btn-delete"
                title="Delete Job"
              >
                <span>✖</span> DELETE
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>

      {/* Global Modals (Siblings to the card to avoid transform trapping) */}
      {showDeleteModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(2, 6, 23, 0.9)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(20px)" }}>
          <div className="glass-card" style={{ maxWidth: "450px", padding: "50px", textAlign: "center", border: "1.5px solid var(--danger)", transform: "none", animation: "fade-in-up 0.3s ease" }}>
            <h2 style={{ color: "var(--danger)", marginBottom: "20px", fontSize: "1.8rem" }}>Delete Job?</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "40px", lineHeight: "1.8", fontSize: "1rem" }}>Are you sure you want to delete **{job.jobNumber}**? This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: "16px", background: "none", color: "var(--text-main)", border: "1.5px solid var(--border)", borderRadius: "16px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: "16px", background: "var(--danger)", color: "white", borderRadius: "16px", fontWeight: 700, border: "none", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(2, 6, 23, 0.9)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(20px)" }}>
          <div className="glass-card" style={{ maxWidth: "800px", width: "95%", padding: "40px", maxHeight: "90vh", overflowY: "auto", transform: "none", animation: "fade-in-up 0.3s ease" }}>
            <h2 style={{ marginBottom: "32px", color: "var(--primary)", fontSize: "2rem" }}>Edit Job</h2>
            <form onSubmit={handleEdit} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              
              <div>
                <h4 style={{ fontSize: "0.8rem", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "20px" }}>Client Details</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 900, textTransform: "uppercase" }}>Company Name</label>
                    <input type="text" value={editedJob.clientCompanyName} onChange={(e) => setEditedJob({...editedJob, clientCompanyName: e.target.value})} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 900, textTransform: "uppercase" }}>Contact Person</label>
                    <input type="text" value={editedJob.clientName} onChange={(e) => setEditedJob({...editedJob, clientName: e.target.value})} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 900, textTransform: "uppercase" }}>Phone</label>
                    <input type="tel" value={editedJob.clientPhone} onChange={(e) => setEditedJob({...editedJob, clientPhone: e.target.value})} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 900, textTransform: "uppercase" }}>Email</label>
                    <input type="email" value={editedJob.clientEmail} onChange={(e) => setEditedJob({...editedJob, clientEmail: e.target.value})} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", gridColumn: "span 2" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 900, textTransform: "uppercase" }}>Address</label>
                    <input type="text" value={editedJob.clientAddress} onChange={(e) => setEditedJob({...editedJob, clientAddress: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: "0.8rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "20px" }}>Specifications</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 900, textTransform: "uppercase" }}>Size</label>
                    <input type="text" value={editedJob.labelSize} onChange={(e) => setEditedJob({...editedJob, labelSize: e.target.value})} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 900, textTransform: "uppercase" }}>Quantity</label>
                    <input type="number" value={editedJob.quantity} onChange={(e) => setEditedJob({...editedJob, quantity: e.target.value})} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 900, textTransform: "uppercase" }}>Priority</label>
                    <select value={editedJob.priority} onChange={(e) => setEditedJob({...editedJob, priority: e.target.value})}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 900, textTransform: "uppercase" }}>Industry</label>
                    <input type="text" value={editedJob.labelIndustry} onChange={(e) => setEditedJob({...editedJob, labelIndustry: e.target.value})} />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}>Notes</label>
                <textarea value={editedJob.addNotes} onChange={(e) => setEditedJob({...editedJob, addNotes: e.target.value})} style={{ minHeight: "100px" }} />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: "18px", background: "none", border: "1.5px solid var(--border)", color: "var(--text-main)", borderRadius: "18px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: "18px", borderRadius: "18px" }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default JobCard;