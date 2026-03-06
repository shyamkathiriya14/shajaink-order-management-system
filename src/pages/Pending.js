import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import JobCard from "../components/JobCard";
import { toast } from "react-toastify";

function Pending() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((job) => !job.status || job.status.toLowerCase() === "pending");
      setJobs(data);
    });
    return () => unsubscribe();
  }, []);

  const moveJobToUpcoming = async (jobId) => {
    try {
      const jobRef = doc(db, "jobs", jobId);
      await updateDoc(jobRef, { status: "Upcoming" });
      toast.success("Job moved to Upcoming!");
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  return (
    <div className="page-entry px-4 md:px-10 pt-[100px] md:pt-[140px] pb-10 max-w-[1200px] mx-auto">
      <div className="mb-10 md:mb-15 text-center">
        <h1 className="text-3xl md:text-5xl font-black text-white m-0 tracking-tight">
          Pending <span className="text-[var(--accent)]">Stream</span>
        </h1>
        <p className="text-[var(--text-muted)] text-base md:text-lg font-medium mt-2">
          Active protocols awaiting initialization
        </p>
      </div>

      <div className="grid gap-4 md:gap-5">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onDelete={handleDelete}>
              <button
                onClick={() => moveJobToUpcoming(job.id)}
                className="btn-primary w-full md:w-auto px-6 py-3.5 rounded-xl text-[0.7rem] font-black uppercase tracking-widest mt-2 md:mt-0"
              >
                DEPLOY TO UPCOMING →
              </button>
            </JobCard>
          ))
        ) : (
          <div className="glass-card p-16 md:p-32 text-center bg-slate-900/20 border-[1.5px] border-dashed border-[var(--border)] rounded-[24px]">
            <p className="text-lg md:text-xl text-[var(--text-muted)] font-semibold">
              No pending streams detected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pending;
