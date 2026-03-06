import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import JobCard from "../components/JobCard";

function Completed() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, "jobs"));
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(job => job.status && job.status.toLowerCase() === "completed");

      setJobs(data);
    };

    fetchJobs();
  }, []);

  const handleDelete = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  return (
    <div>
      <h2>Completed Jobs</h2>
      {jobs.length === 0 ? <p>No completed jobs.</p> : jobs.map(job => (
        <JobCard key={job.id} job={job} onDelete={handleDelete} />
      ))}
    </div>
  );
}

export default Completed;
