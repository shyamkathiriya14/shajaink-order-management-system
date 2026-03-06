import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import JobCard from "../components/JobCard";
import Pagination from "../components/Pagination";
import PendingJobs from "../assets/pending-jobs.svg";
import RunningJobs from "../assets/running-jobs.svg";
import CompletedJobs from "../assets/complated-jobs.svg";
import AllJobs from "../assets/all-jobs.svg";
import DownArrow from "../assets/down-arrow.svg";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(list);
    });
    return () => unsubscribe();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const matchesSearch =
      (job.jobNumber &&
        job.jobNumber.toLowerCase().includes(normalizedSearch)) ||
      (job.clientName &&
        job.clientName.toLowerCase().includes(normalizedSearch)) ||
      (job.clientCompanyName &&
        job.clientCompanyName.toLowerCase().includes(normalizedSearch));

    const matchesStatus = filterStatus === "All" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: jobs.length,
    pending: jobs.filter((j) => j.status?.toLowerCase() === "pending").length,
    running: jobs.filter((j) => j.status?.toLowerCase() === "running").length,
    completed: jobs.filter((j) => j.status?.toLowerCase() === "completed")
      .length,
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  return (
    <div className="page-entry sm:px-4 md:px-0 xl:px-15 pt-[100px] md:pt-[140px] pb-6 sm:pb-8 md:pb-10 max-w-[1500px] mx-auto">
      {/* Dashboard Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 xl:gap-8 mb-14 xl:mb-20">
        {[
          {
            label: "Total Jobs",
            value: counts.all,
            color: "var(--primary)",
            glow: "var(--primary-glow)",
            icon: (
              <img
                src={AllJobs}
                alt="All Jobs"
                className="max-w-[60px] xl:max-w-[80px] w-auto h-auto"
              />
            ),
          },
          {
            label: "Pending",
            value: counts.pending,
            color: "var(--accent)",
            glow: "var(--accent-glow)",
            icon: (
              <img
                src={PendingJobs}
                alt="Pending"
                className="max-w-[60px] xl:max-w-[80px] w-auto h-auto"
              />
            ),
          },
          {
            label: "Running",
            value: counts.running,
            color: "var(--warning)",
            glow: "var(--warning-glow)",
            icon: (
              <img
                src={RunningJobs}
                alt="Running"
                className="max-w-[60px] xl:max-w-[80px] w-auto h-auto"
              />
            ),
          },
          {
            label: "Completed",
            value: counts.completed,
            color: "var(--success)",
            glow: "var(--success-glow)",
            icon: (
              <img
                src={CompletedJobs}
                alt="Completed"
                className="max-w-[60px] xl:max-w-[80px] w-auto h-auto"
              />
            ),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-6 md:p-[36px_28px] border-t-4 bg-slate-900/40 flex justify-between items-center transition-all duration-300"
            style={{ borderTopColor: stat.color }}
          >
            <div>
              <p className="m-0 text-[0.7rem] md:text-[0.75rem] font-black text-[var(--text-muted)] uppercase tracking-widest">
                {stat.label}
              </p>
              <h2
                className="mt-2 md:mt-4 mb-0 text-3xl md:text-5xl text-white font-extrabold"
                style={{ textShadow: `0 0 30px ${stat.glow}` }}
              >
                {stat.value}
              </h2>
            </div>
            <span
              className="text-3xl md:text-4xl opacity-30"
              style={{ color: stat.color }}
            >
              {stat.icon}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-8 md:gap-10">
        <div className="w-full md:w-auto">
          <h2 className="text-[2rem] md:text-[2.4rem] font-extrabold text-white mb-2 md:mb-3 tracking-tighter">
            All Jobs
          </h2>
          <p className="text-[var(--text-muted)] text-base md:text-[1.1rem] font-medium font-outfit">
            Track and manage all your print orders
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group w-full sm:w-[350px]">
            <input
              type="text"
              placeholder="Search ID or Company..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 h-12 md:h-14 bg-white/5 border-[1.5px] border-[var(--border)] text-white rounded-xl md:rounded-2xl focus:border-[var(--primary)] outline-none transition-all placeholder:text-[var(--text-muted)] font-medium"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-lg">
              🔍
            </span>
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-[200px] h-12 md:h-14 bg-[var(--bg-graphite)] border-[1.5px] border-[var(--border)] text-white px-4 md:px-5 rounded-xl md:rounded-2xl cursor-pointer outline-none focus:border-[var(--primary)] transition-all font-bold appearance-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Running">Running</option>
              <option value="Completed">Completed</option>
            </select>
            <img
              className="absolute top-1/2 right-[18px] w-[14px] h-auto -translate-y-1/2"
              src={DownArrow}
              alt="DownArrow"
            />
          </div>
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
              />
            ))
          ) : (
            <div className="text-center py-10 opacity-50 font-bold tracking-widest text-[var(--text-muted)]">
              SYNCING PAGE...
            </div>
          )
        ) : (
          <div className="glass-card p-16 md:p-32 text-center bg-slate-900/20 border-[1.5px] border-dashed border-[var(--border)] animate-fade-in rounded-[24px]">
            <div className="text-5xl md:text-[5rem] mb-4 md:mb-8 opacity-20">
              ∅
            </div>
            <p className="text-xl md:text-2xl text-[var(--text-muted)] mb-6 md:mb-10 font-semibold">
              No job records found
            </p>
            <button
              className="btn-primary px-8 py-4"
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("All");
              }}
            >
              Reset Search
            </button>
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

export default Home;
