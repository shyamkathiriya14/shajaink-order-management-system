import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const ref = doc(db, "jobs", id);
      const snap = await getDoc(ref);
      setJob(snap.data());
    };

    fetchJob();
  }, [id]);

  const changeStatus = async (status) => {
    try {
      const ref = doc(db, "jobs", id);
      await updateDoc(ref, { status });
      setJob({ ...job, status }); // Update local state to reflect UI change instantly
      toast.success(`Status Updated to ${status}`);
    } catch (error) {
      console.error("DEBUG: Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if(!job) return <p>Loading...</p>

  return(
    <div>
      <h2 style={{ borderBottom: "2px solid #ccc", paddingBottom: "10px" }}>{job.jobNumber}</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
        <div>
          <p style={{ margin: "5px 0" }}><strong>Company Name:</strong> {job.clientCompanyName || "N/A"}</p>
          <p style={{ margin: "5px 0" }}><strong>Client Name:</strong> {job.clientName}</p>
          <p style={{ margin: "5px 0" }}><strong>Phone:</strong> {job.clientPhone || "N/A"}</p>
          <p style={{ margin: "5px 0" }}><strong>Email:</strong> {job.clientEmail || "N/A"}</p>
          <p style={{ margin: "5px 0" }}><strong>Address:</strong> {job.clientAddress || "N/A"}</p>
        </div>
        <div>
          <p style={{ margin: "5px 0" }}><strong>Label Size:</strong> {job.labelSize}</p>
          <p style={{ margin: "5px 0" }}><strong>Quantity:</strong> {job.quantity}</p>
          <p style={{ margin: "5px 0" }}><strong>Industry:</strong> {job.labelIndustry || "N/A"}</p>
          <p style={{ margin: "5px 0" }}>
            <strong>Priority: </strong>
            <span style={{ color: job.priority === 'High' ? 'red' : job.priority === 'Medium' ? 'darkorange' : 'green', fontWeight: 'bold' }}>
              {job.priority || "Medium"}
            </span>
          </p>
        </div>
      </div>

      {job.imageUrl && (
        <div style={{ marginBottom: "20px" }}>
          <strong>Label Design:</strong>
          <div style={{ marginTop: "10px" }}>
            <a href={job.imageUrl} target="_blank" rel="noopener noreferrer">
              <img 
                src={job.imageUrl} 
                alt="Label Design" 
                style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px", border: "1px solid #ddd", cursor: "zoom-in" }} 
              />
            </a>
          </div>
        </div>
      )}
      
      {job.addNotes && (
        <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "8px", borderLeft: "4px solid #007bff", marginBottom: "20px" }}>
          <strong>Notes:</strong>
          <p style={{ margin: "5px 0", whiteSpace: "pre-wrap" }}>{job.addNotes}</p>
        </div>
      )}
      
      <div style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "10px" }}>
        <strong>Status: </strong>
        <select 
          value={job.status} 
          onChange={(e) => changeStatus(e.target.value)}
          style={{ padding: "5px", borderRadius: "4px" }}
        >
          <option value="Pending">Pending</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Running">Running</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

    </div>
  )
}

export default JobDetails;