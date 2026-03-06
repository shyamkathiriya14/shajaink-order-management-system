import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function JobCard({ job, children, onDelete }) {
  const [currentJob, setCurrentJob] = useState(job);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // New state for delete modal
  
  // Edit form states
  const [editData, setEditData] = useState({
    clientCompanyName: job.clientCompanyName || "",
    clientName: job.clientName || "",
    clientPhone: job.clientPhone || "",
    clientEmail: job.clientEmail || "",
    clientAddress: job.clientAddress || "",
    labelSize: job.labelSize || "",
    quantity: job.quantity || "",
    labelIndustry: job.labelIndustry || "",
    priority: job.priority || "Medium",
    addNotes: job.addNotes || "",
  });

  const handleDeleteConfirm = async () => {
    try {
      await deleteDoc(doc(db, "jobs", currentJob.id));
      toast.success("Job deleted successfully!");
      if (onDelete) {
        onDelete(currentJob.id); // Call parent wrapper function to update state cleanly
      } else {
        // Fallback if onDelete is not passed
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job.");
    } finally {
      setIsDeleting(false); // Close modal whether success or error
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const jobRef = doc(db, "jobs", currentJob.id);
      await updateDoc(jobRef, {
        clientCompanyName: editData.clientCompanyName,
        clientName: editData.clientName,
        clientPhone: editData.clientPhone,
        clientEmail: editData.clientEmail,
        clientAddress: editData.clientAddress,
        labelSize: editData.labelSize,
        quantity: Number(editData.quantity),
        labelIndustry: editData.labelIndustry,
        priority: editData.priority,
        addNotes: editData.addNotes
      });
      
      setCurrentJob({
        ...currentJob,
        ...editData,
        quantity: Number(editData.quantity)
      });
      
      toast.success("Job updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = String(date.getDate()).padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `Created: ${day}-${month}-${year}`;
  };

  return (
    <>
      <div className="job-card" style={{ border: "1px solid #ccc", padding: "15px", margin: "10px 0", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ marginTop: 0 }}>{currentJob.jobNumber}</h3>
          <span style={{ fontSize: "14px", color: "#666", fontWeight: "bold" }}>{formatDate(currentJob.createdAt)}</span>
        </div>
        <p style={{ margin: "5px 0" }}><strong>Client:</strong> {currentJob.clientName}</p>
        <p style={{ margin: "5px 0" }}><strong>Size:</strong> {currentJob.labelSize}</p>
        <p style={{ margin: "5px 0" }}><strong>Quantity:</strong> {currentJob.quantity}</p>
        <div style={{ display: "flex", gap: "15px", margin: "5px 0" }}>
          <p style={{ margin: 0, color: currentJob.status === "Completed" ? "green" : currentJob.status === "Running" ? "orange" : "blue" }}>
            <strong>Status:</strong> {currentJob.status}
          </p>
          {currentJob.priority && (
            <p style={{ margin: 0 }}>
              <strong>Priority: </strong>
              <span style={{ 
                fontWeight: "bold",
                color: currentJob.priority === "High" ? "red" : currentJob.priority === "Medium" ? "darkorange" : "green" 
              }}>
                {currentJob.priority}
              </span>
            </p>
          )}
        </div>
        
        <div style={{ display: "flex", gap: "10px", marginTop: "15px", alignItems: "center" }}>
          <Link to={`/job/${currentJob.id}`}>
            <button style={{ padding: "8px 12px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}>
              View Details
            </button>
          </Link>
          <button 
            onClick={() => setIsEditing(true)}
            style={{ padding: "8px 12px", cursor: "pointer", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px" }}
          >
            Edit
          </button>
          <button 
            onClick={() => setIsDeleting(true)}
            style={{ padding: "8px 12px", cursor: "pointer", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
          >
            Delete
          </button>
          {children}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleting && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "8px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <h3 style={{ marginTop: 0, color: "#dc3545" }}>Delete Job</h3>
            <p>Are you sure you want to delete job <strong>{currentJob.jobNumber}</strong>?</p>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>This action cannot be undone.</p>
            
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button 
                onClick={handleDeleteConfirm}
                style={{ flex: 1, padding: "10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Yes, Delete
              </button>
              <button 
                onClick={() => setIsDeleting(false)}
                style={{ flex: 1, padding: "10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL POPUP */}
      {isEditing && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(3px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }} >
          <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "8px", width: "100%", maxWidth: "450px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems:'center', marginBottom: '20px'}}>
            <h3 style={{ margin: 0 }}>Edit Job ({currentJob.jobNumber})</h3>
            <span style={{fontSize: '30px', cursor: 'pointer'}} onClick={() => setIsEditing(false)}>x</span>
            </div>
            
            <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px" }}>Company Name:</label>
                <input type="text" value={editData.clientCompanyName} onChange={(e) => setEditData({...editData, clientCompanyName: e.target.value})} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px" }}>Client Name:</label>
                <input type="text" value={editData.clientName} onChange={(e) => setEditData({...editData, clientName: e.target.value})} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} required />
              </div>
              
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px" }}>Phone:</label>
                <input type="tel" value={editData.clientPhone} onChange={(e) => setEditData({...editData, clientPhone: e.target.value})} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px" }}>Email:</label>
                <input type="email" value={editData.clientEmail} onChange={(e) => setEditData({...editData, clientEmail: e.target.value})} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px" }}>Address:</label>
                <textarea value={editData.clientAddress} onChange={(e) => setEditData({...editData, clientAddress: e.target.value})} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "60px" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px" }}>Label Size:</label>
                <input type="text" value={editData.labelSize} onChange={(e) => setEditData({...editData, labelSize: e.target.value})} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} required />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px" }}>Quantity:</label>
                <input type="number" value={editData.quantity} onChange={(e) => setEditData({...editData, quantity: e.target.value})} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} required />
              </div>
              
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px" }}>Industry:</label>
                <input type="text" value={editData.labelIndustry} onChange={(e) => setEditData({...editData, labelIndustry: e.target.value})} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px" }}>Priority:</label>
                <select value={editData.priority} onChange={(e) => setEditData({...editData, priority: e.target.value})} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px" }}>Notes:</label>
                <textarea value={editData.addNotes} onChange={(e) => setEditData({...editData, addNotes: e.target.value})} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px" }} />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button 
                  type="submit" 
                  style={{ flex: 1, padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  style={{ flex: 1, padding: "10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default JobCard;