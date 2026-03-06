import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import JobCard from "../components/JobCard";
import { toast } from "react-toastify";

function Pending(){

const [jobs,setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, "jobs"));
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(job => !job.status || job.status.toLowerCase() === "pending");

      setJobs(data);
    };

    fetchJobs();
  }, []);

  const handleMoveToUpcoming = async (jobId) => {
    try {
      const jobRef = doc(db, "jobs", jobId);
      await updateDoc(jobRef, { status: "Upcoming" });
      setJobs(jobs.filter(job => job.id !== jobId));
      toast.success("Job moved to Upcoming!");
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update status!");
    }
  };

  const handleDelete = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  return(
    <div>
      <h2>Pending Jobs</h2>
      {jobs.length === 0 ? <p>No pending jobs.</p> : jobs.map(job=>(
        <JobCard key={job.id} job={job} onDelete={handleDelete}>
          <button 
            onClick={() => handleMoveToUpcoming(job.id)}
            style={{ padding: "8px 12px", cursor: "pointer", backgroundColor: "#ffc107", color: "black", border: "none", borderRadius: "4px" }}
          >
            Move to Upcoming
          </button>
        </JobCard>
      ))}
    </div>
  )

}

export default Pending;