import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import JobCard from "../components/JobCard";
import { toast } from "react-toastify";

function Running() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, "jobs"));
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(job => job.status && job.status.toLowerCase() === "running");

      setJobs(data);
    };

    fetchJobs();
  }, []);

  const handleComplete = async (jobId) => {
    try {
      const jobRef = doc(db, "jobs", jobId);
      await updateDoc(jobRef, { status: "Completed" });
      setJobs(jobs.filter(job => job.id !== jobId));
      toast.success("Job marked as Completed!");
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update status!");
    }
  };

  const handleDelete = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  return (
    <div>
      <h2>Running Jobs</h2>
      {jobs.length === 0 ? <p>No running jobs.</p> : jobs.map(job => (
        <JobCard key={job.id} job={job} onDelete={handleDelete}>
          <button 
            onClick={() => handleComplete(job.id)}
            style={{ padding: "8px 12px", cursor: "pointer", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px" }}
          >
            Complete Job
          </button>
        </JobCard>
      ))}
    </div>
  );
}

export default Running;
