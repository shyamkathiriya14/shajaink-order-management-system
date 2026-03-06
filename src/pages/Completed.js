import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import JobCard from "../components/JobCard";

function Completed() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const archived = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((job) => job.status?.toLowerCase() === "completed");
      setJobs(archived);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-[var(--primary)]">
        <div className="brand-font text-[1.5rem] md:text-[2rem] animate-pulse">
          Retrieving Archives...
        </div>
      </div>
    );

  return (
    <div className="page-entry px-4 md:px-10 pt-[100px] md:pt-[140px] pb-10 max-w-[1200px] mx-auto">
      <div className="mb-10 md:mb-15 text-center">
        <h1 className="text-3xl md:text-5xl font-black text-white m-0 tracking-tight">
          Completed <span className="text-[var(--success)]">Archives</span>
        </h1>
        <p className="text-[var(--text-muted)] text-base md:text-lg font-medium mt-2">
          Successfully terminated job sequences
        </p>
      </div>

      <div className="grid gap-4 md:gap-5">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={(id) => setJobs(jobs.filter((j) => j.id !== id))}
            />
          ))
        ) : (
          <div className="glass-card p-16 md:p-32 text-center bg-slate-900/20 border-[1.5px] border-dashed border-[var(--border)] rounded-[24px]">
            <p className="text-lg md:text-xl text-[var(--text-muted)] font-semibold">
              No archived protocols found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Completed;
