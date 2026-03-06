import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import JobCard from "../components/JobCard";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";

function Running() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

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

  const filteredJobs = jobs.filter((job) => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return (
      (job.jobNumber &&
        job.jobNumber.toLowerCase().includes(normalizedSearch)) ||
      (job.clientName &&
        job.clientName.toLowerCase().includes(normalizedSearch)) ||
      (job.clientCompanyName &&
        job.clientCompanyName.toLowerCase().includes(normalizedSearch))
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredJobs.length, totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-[var(--primary)]">
        <div className="brand-font text-[1.5rem] md:text-[2rem] animate-pulse">
          Scanning Active Streams...
        </div>
      </div>
    );

  return (
    <div className="page-entry sm:px-4 md:px-10 pt-[100px] md:pt-[140px] pb-10 max-w-[1200px] mx-auto">
      <div className="mb-10 md:mb-15">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-white m-0 tracking-tight">
            Running <span className="text-[var(--warning)]">Jobs</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base md:text-lg font-medium mt-2">
            Active production protocols in progress
          </p>
        </div>

        <div className="max-w-[500px] mx-auto relative group">
          <input
            type="text"
            placeholder="Search by ID, Name or Company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 h-12 md:h-14 bg-white/5 border-[1.5px] border-[var(--border)] text-white rounded-xl md:rounded-2xl focus:border-[var(--primary)] outline-none transition-all placeholder:text-[var(--text-muted)]/30 font-medium shadow-xl"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-lg">
            🔍
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:gap-5">
        {filteredJobs.length > 0 ? (
          currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDelete={(id) => setJobs(jobs.filter((j) => j.id !== id))}
              >
                <button
                  onClick={() => completeJob(job.id)}
                  className="btn-primary w-full md:w-auto px-8 py-3.5 rounded-xl text-[0.7rem] font-black uppercase tracking-widest mt-2 md:mt-0 bg-[var(--success)] shadow-[0_10px_20px_rgba(34,197,94,0.2)]"
                >
                  COMPLETE JOB
                </button>
              </JobCard>
            ))
          ) : (
            <div className="text-center py-10 opacity-50 font-bold tracking-widest text-[var(--text-muted)]">
              UPDATING STREAMS...
            </div>
          )
        ) : (
          <div className="glass-card p-16 md:p-32 text-center bg-slate-900/20 border-[1.5px] border-dashed border-[var(--border)] rounded-[24px]">
            <p className="text-lg md:text-xl text-[var(--text-muted)] font-semibold">
              No active operations detected.
            </p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Running;
