import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import JobCard from "../components/JobCard";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(list);
    });
    return () => unsubscribe();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      (job.jobNumber &&
        job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.clientName &&
        job.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.clientCompanyName &&
        job.clientCompanyName.toLowerCase().includes(searchTerm.toLowerCase()));

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

  return (
    <div className="page-entry px-4 md:px-10 lg:px-15 pt-[100px] md:pt-[140px] pb-10 max-w-[1500px] mx-auto">
      {/* Dashboard Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-20">
        {[
          {
            label: "Total Jobs",
            value: counts.all,
            color: "var(--primary)",
            glow: "var(--primary-glow)",
            icon: "≣",
          },
          {
            label: "Pending",
            value: counts.pending,
            color: "var(--accent)",
            glow: "var(--accent-glow)",
            icon: "○",
          },
          {
            label: "Running",
            value: counts.running,
            color: "var(--warning)",
            glow: "var(--warning-glow)",
            icon: "◈",
          },
          {
            label: "Completed",
            value: counts.completed,
            color: "var(--success)",
            glow: "var(--success-glow)",
            icon: "●",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-6 md:p-10 border-t-4 bg-slate-900/40 flex justify-between items-center transition-all duration-300 hover:scale-[1.02]"
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 h-12 md:h-14 bg-white/5 border-[1.5px] border-[var(--border)] text-white rounded-xl md:rounded-2xl focus:border-[var(--primary)] outline-none transition-all placeholder:text-[var(--text-muted)] font-medium"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-lg">
              🔍
            </span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-[200px] h-12 md:h-14 bg-[var(--bg-graphite)] border-[1.5px] border-[var(--border)] text-white px-4 md:px-5 rounded-xl md:rounded-2xl cursor-pointer outline-none focus:border-[var(--primary)] transition-all font-bold appearance-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Running">Running</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:gap-5">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={(id) => setJobs(jobs.filter((j) => j.id !== id))}
            />
          ))
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
              RESET DASHBOARD
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
