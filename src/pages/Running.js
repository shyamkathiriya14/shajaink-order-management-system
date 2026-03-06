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
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((job) => job.status?.toLowerCase() === "running");
      setJobs(active);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const completeJob = async (jobId) => {
    try {
      const jobRef = doc(db, "jobs", jobId);
      await updateDoc(jobRef, { status: "Completed" });
      toast.success("Job marked as Completed!");
    } catch (error) {
      console.error("Error completing job:", error);
      toast.error("Failed to complete job.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-[var(--primary)]">
        <div className="brand-font text-[1.5rem] md:text-[2rem] animate-pulse">
          Scanning Active Streams...
        </div>
      </div>
    );

  return (
    <div className="page-entry px-4 md:px-10 pt-[100px] md:pt-[140px] pb-10 max-w-[1200px] mx-auto">
      <div className="mb-10 md:mb-15 text-center">
        <h1 className="text-3xl md:text-5xl font-black text-white m-0 tracking-tight">
          Running <span className="text-[var(--warning)]">Operations</span>
        </h1>
        <p className="text-[var(--text-muted)] text-base md:text-lg font-medium mt-2">
          Active production protocols in progress
        </p>
      </div>

      <div className="grid gap-4 md:gap-5">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={(id) => setJobs(jobs.filter((j) => j.id !== id))}
            >
              <button
                onClick={() => completeJob(job.id)}
                className="btn-primary w-full md:w-auto px-8 py-3.5 rounded-xl text-[0.7rem] font-black uppercase tracking-widest mt-2 md:mt-0 bg-[var(--success)] shadow-[0_10px_20px_rgba(34,197,94,0.2)]"
              >
                FINALIZE PROTOCOL ●
              </button>
            </JobCard>
          ))
        ) : (
          <div className="glass-card p-16 md:p-32 text-center bg-slate-900/20 border-[1.5px] border-dashed border-[var(--border)] rounded-[24px]">
            <p className="text-lg md:text-xl text-[var(--text-muted)] font-semibold">
              No active operations detected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Running;
