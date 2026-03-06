import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const ref = doc(db, "jobs", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setJob(snap.data());
        } else {
          toast.error("Error: Job not found.");
        }
      } catch (error) {
        toast.error("Error fetching job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const changeStatus = async (status) => {
    try {
      const ref = doc(db, "jobs", id);
      await updateDoc(ref, { status });
      setJob({ ...job, status });
      toast.success(`Status updated to: ${status}`);
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "var(--warning)";
      case "upcoming":
        return "var(--primary)";
      case "running":
        return "var(--success)";
      case "completed":
        return "var(--text-muted)";
      default:
        return "var(--text-muted)";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "var(--danger)";
      case "Medium":
        return "var(--warning)";
      case "Low":
        return "var(--success)";
      default:
        return "var(--text-muted)";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-[var(--primary)]">
        <div className="brand-font text-[1.5rem] md:text-[2rem] animate-pulse">
          Synchronizing Data...
        </div>
      </div>
    );

  if (!job)
    return (
      <div className="page-entry px-5 pt-[140px] text-center">
        <h2 className="text-[var(--text-muted)] text-2xl mb-6">
          Archive Segment Not Found.
        </h2>
        <Link
          to="/"
          className="text-[var(--primary)] font-black no-underline hover:opacity-80 transition-opacity tracking-widest uppercase text-sm"
        >
          ← Return to Main Console
        </Link>
      </div>
    );

  return (
    <div className="page-entry px-4 md:px-10 lg:px-20 pt-[100px] md:pt-[140px] pb-10 max-w-[1300px] mx-auto">
      <Link
        to="/"
        className="inline-block mb-8 text-[var(--text-muted)] no-underline hover:text-white transition-colors font-black tracking-widest text-[0.7rem] uppercase"
      >
        ← BACK TO STREAM
      </Link>

      <div className="glass-card overflow-hidden bg-[#020619]/60">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_450px]">
          <div className="p-6 md:p-12 lg:p-15 border-b lg:border-b-0 lg:border-r border-white/5">
            <header className="mb-10 md:mb-15">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-md text-[0.65rem] md:text-[0.7rem] font-black tracking-widest uppercase border border-[var(--primary)]/20">
                  JOB SEGMENT
                </span>
                <span className="text-[var(--text-muted)] opacity-50 text-sm md:text-base">
                  •
                </span>
                <p className="m-0 text-[var(--text-muted)] text-sm md:text-base font-bold">
                  {new Date(job.createdAt).toLocaleString()}
                </p>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white m-0 tracking-tighter leading-tight">
                {job.jobNumber}
              </h1>
              <p className="text-[var(--text-muted)] text-lg md:text-xl font-medium mt-3 md:mt-4 opacity-70">
                {job.clientCompanyName || "External Entity"}
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-15">
              <div className="flex flex-col gap-2">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-50">
                  Operational Status
                </label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{
                        backgroundColor: getStatusColor(job.status),
                        boxShadow: `0 0 10px ${getStatusColor(job.status)}`,
                      }}
                    ></span>
                    <span className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                      {job.status}
                    </span>
                  </div>
                  <select
                    value={job.status || "Pending"}
                    onChange={(e) => changeStatus(e.target.value)}
                    className="w-full sm:w-[200px] bg-[var(--bg-graphite)] border-[1.5px] border-[var(--border)] text-white px-4 py-3 rounded-xl cursor-pointer outline-none focus:border-[var(--primary)] transition-all font-bold appearance-none text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Running">Running</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-50">
                  Priority Protocol
                </label>
                <p
                  className="text-xl md:text-2xl font-black text-white uppercase tracking-tight"
                  style={{ color: getPriorityColor(job.priority) }}
                >
                  {job.priority} Level
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              <div className="p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl">
                <h4 className="text-[var(--primary)] text-[0.7rem] md:text-[0.75rem] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></span>
                  Specifications
                </h4>
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-[0.6rem] text-[var(--text-muted)] font-black uppercase tracking-widest block mb-1">
                      Architecture
                    </label>
                    <p className="text-lg md:text-xl font-bold text-white mb-0">
                      {job.labelSize}
                    </p>
                  </div>
                  <div>
                    <label className="text-[0.6rem] text-[var(--text-muted)] font-black uppercase tracking-widest block mb-1">
                      Volume Output
                    </label>
                    <p className="text-2xl md:text-3xl font-black text-[var(--primary)] mb-0">
                      {job.quantity?.toLocaleString()}{" "}
                      <span className="text-sm font-medium opacity-50">
                        UNIT_BLOCKS
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-[0.6rem] text-[var(--text-muted)] font-black uppercase tracking-widest block mb-1">
                      Industry Sector
                    </label>
                    <p className="text-lg md:text-xl font-bold text-white mb-0">
                      {job.labelIndustry || "General Industrial"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl">
                <h4 className="text-[var(--accent)] text-[0.7rem] md:text-[0.75rem] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                  Comms Intel
                </h4>
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-[0.6rem] text-[var(--text-muted)] font-black uppercase tracking-widest block mb-1">
                      Auth. Contact
                    </label>
                    <p className="text-lg md:text-xl font-bold text-white mb-0">
                      {job.clientName}
                    </p>
                  </div>
                  <div>
                    <label className="text-[0.6rem] text-[var(--text-muted)] font-black uppercase tracking-widest block mb-1">
                      Direct Comms
                    </label>
                    <p className="text-lg font-bold text-white mb-0">
                      {job.clientPhone || "STREAMS_OFFLINE"}
                    </p>
                    <p className="text-sm font-medium text-[var(--text-muted)] mt-1">
                      {job.clientEmail}
                    </p>
                  </div>
                  <div>
                    <label className="text-[0.6rem] text-[var(--text-muted)] font-black uppercase tracking-widest block mb-1">
                      Base Origin
                    </label>
                    <p className="text-base font-bold text-white mb-0 leading-snug">
                      {job.clientAddress || "UNDEFINED_LOCATION"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 md:mt-15 p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl">
              <h4 className="text-white text-[0.7rem] font-black uppercase tracking-[0.2em] mb-5">
                Operational Directives
              </h4>
              <p className="text-[var(--text-muted)] text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap">
                {job.addNotes ||
                  "No specific directives logged for this segment."}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-12 lg:p-15 bg-white/[0.01]">
            <h4 className="text-[var(--success)] text-[0.7rem] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>
              Visual Interface
            </h4>

            {job.imageUrl ? (
              <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                <a
                  href={job.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={job.imageUrl}
                    alt="Job Blueprint"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </a>
              </div>
            ) : (
              <div className="rounded-2xl md:rounded-3xl border-2 border-dashed border-white/5 h-[300px] md:h-[400px] lg:h-[500px] flex flex-col items-center justify-center bg-white/[0.02] text-center p-8 md:p-12">
                <span className="text-5xl md:text-6xl mb-6 opacity-20">🖼️</span>
                <p className="text-[var(--text-muted)] text-lg md:text-xl font-bold opacity-40">
                  NO_BLUEPRINT_LOGGED
                </p>
                <p className="text-[0.65rem] md:text-[0.7rem] text-[var(--text-muted)] uppercase tracking-widest mt-3 opacity-30 px-6">
                  Visual data stream unavailable for this job segment
                </p>
              </div>
            )}

            <div className="mt-10 md:mt-15">
              <Link to={`/`} className="no-underline">
                <button className="btn-primary w-full py-5 md:py-6 text-base font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(0,112,255,0.2)]">
                  RETURN TO CONSOLE
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
