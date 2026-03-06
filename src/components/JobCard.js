import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function JobCard({ job, onDelete, children }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedJob, setEditedJob] = useState({ ...job });

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "jobs", job.id));
      onDelete(job.id);
      toast.info("Job deleted successfully.");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Error deleting job.");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const { id, ...dataToUpdate } = editedJob;
      await updateDoc(doc(db, "jobs", job.id), dataToUpdate);
      toast.success("Job updated successfully.");
      setShowEditModal(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update job.");
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "completed")
      return <span className="badge badge-success">● COMPLETED</span>;
    if (s === "running")
      return <span className="badge badge-running">◈ RUNNING</span>;
    return <span className="badge badge-pending">○ PENDING</span>;
  };

  const getPriorityColor = (p) => {
    if (p === "High") return "var(--danger)";
    if (p === "Medium") return "var(--warning)";
    return "var(--success)";
  };

  // Body Scroll Lock for Modal
  useEffect(() => {
    if (showEditModal || showDeleteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showEditModal, showDeleteModal]);

  return (
    <>
      <div className="glass-card p-5 md:p-8 mb-4 relative bg-slate-900/50 hover:border-[var(--primary)] group transition-all duration-500">
        <div className="flex flex-col md:grid md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-start">
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <h3 className="text-xl md:text-2xl text-white m-0 font-extrabold tracking-tight">
                {job.jobNumber}
              </h3>
              {getStatusBadge(job.status)}
              <span
                className="text-[0.6rem] md:text-[0.65rem] font-black px-2.5 py-1 bg-white/5 border rounded-md tracking-widest uppercase"
                style={{
                  color: getPriorityColor(job.priority),
                  borderColor: getPriorityColor(job.priority),
                }}
              >
                {job.priority} Priority
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              <div className="border-l-[3px] border-[var(--primary)] pl-4 md:pl-5">
                <p className="m-0 text-[0.65rem] md:text-[0.7rem] text-[var(--text-muted)] uppercase font-black tracking-widest">
                  Client Console
                </p>
                <p className="mt-1.5 mb-0 text-base md:text-lg font-bold text-[var(--text-platinum)] truncate">
                  {job.clientCompanyName || "Unregistered Entity"}
                </p>
                <p className="mt-0.5 mb-0 text-sm text-[var(--text-muted)] font-medium">
                  {job.clientName}
                </p>
              </div>

              <div>
                <p className="m-0 text-[0.65rem] md:text-[0.7rem] text-[var(--text-muted)] uppercase font-black tracking-widest">
                  Specifications
                </p>
                <p className="mt-1.5 mb-0 text-base md:text-lg font-bold text-[var(--text-platinum)]">
                  {job.labelSize}
                </p>
                <p className="mt-0.5 mb-0 text-sm text-[var(--primary)] font-black">
                  {job.quantity?.toLocaleString()} UNITS
                </p>
              </div>

              <div className="md:text-right flex flex-col items-start md:items-end">
                <p className="m-0 text-[0.65rem] md:text-[0.7rem] text-[var(--text-muted)] uppercase font-black tracking-widest">
                  Logged Date
                </p>
                <p className="mt-1.5 mb-0 text-sm text-[var(--text-muted)] font-semibold">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <Link
                  to={`/job/${job.id}`}
                  className="no-underline inline-block mt-4 text-[0.75rem] text-[var(--primary)] font-black tracking-wider hover:opacity-80 transition-opacity"
                >
                  VIEW FULL DETAILS →
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-white/5 items-center md:items-end">
            <div className="flex gap-2 w-full justify-start md:justify-end">
              <button
                onClick={() => setShowEditModal(true)}
                className="btn-premium btn-edit flex-1 md:flex-none justify-center px-4 py-3"
                title="Modify Config"
              >
                📝 <span className="hidden sm:inline">EDIT</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn-premium btn-delete flex-1 md:flex-none justify-center px-4 py-3"
                title="Terminate Stream"
              >
                🗑️ <span className="hidden sm:inline">DELETE</span>
              </button>
            </div>
            {children && (
              <div className="w-full pt-4 md:pt-2 border-t md:border-t-0 border-white/5">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 w-full h-full bg-[#020617]/95 z-[9999] flex items-center justify-center backdrop-blur-2xl p-4">
          <div className="glass-card max-w-[450px] w-full p-8 md:p-12 text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-white mb-4 text-2xl md:text-3xl font-black tracking-tight">
              Delete Job?
            </h2>
            <p className="text-[var(--text-muted)] mb-10 text-sm md:text-base font-medium leading-relaxed">
              This will permanently terminate job{" "}
              <span className="text-white font-bold">{job.jobNumber}</span>.
              This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 p-4 bg-transparent border-[1.5px] border-[var(--border)] text-white rounded-xl md:rounded-2xl font-bold cursor-pointer hover:bg-white/5 transition-all text-[0.7rem] uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-primary flex-1 p-4 rounded-xl md:rounded-2xl bg-[var(--danger)] border-none shadow-[0_15px_30px_rgba(239,68,68,0.25)] text-[0.7rem] uppercase tracking-widest font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 w-full h-full bg-[#020617]/95 z-[9999] flex items-center justify-center backdrop-blur-2xl p-4">
          <div className="glass-card max-w-[850px] w-full p-6 md:p-10 max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-[var(--primary)] text-xl md:text-3xl font-black tracking-tight uppercase">
                Edit Job Details
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-[var(--text-muted)] hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEdit} className="flex flex-col gap-10">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary-glow)]"></div>
                  <h4 className="text-[0.7rem] text-white uppercase tracking-[0.2em] font-black">
                    Client Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[0.65rem] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium"
                      value={editedJob.clientCompanyName}
                      onChange={(e) =>
                        setEditedJob({
                          ...editedJob,
                          clientCompanyName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[0.65rem] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium"
                      value={editedJob.clientName}
                      onChange={(e) =>
                        setEditedJob({
                          ...editedJob,
                          clientName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[0.65rem] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium"
                      value={editedJob.clientPhone}
                      onChange={(e) =>
                        setEditedJob({
                          ...editedJob,
                          clientPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[0.65rem] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium"
                      value={editedJob.clientEmail}
                      onChange={(e) =>
                        setEditedJob({
                          ...editedJob,
                          clientEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2.5 md:col-span-2">
                    <label className="text-[0.65rem] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium"
                      value={editedJob.clientAddress}
                      onChange={(e) =>
                        setEditedJob({
                          ...editedJob,
                          clientAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]"></div>
                  <h4 className="text-[0.7rem] text-white uppercase tracking-[0.2em] font-black">
                    Job Specifications
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[0.65rem] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">
                      Label Size
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium"
                      value={editedJob.labelSize}
                      onChange={(e) =>
                        setEditedJob({
                          ...editedJob,
                          labelSize: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[0.65rem] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium"
                      value={editedJob.quantity}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, quantity: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[0.65rem] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">
                      Priority
                    </label>
                    <select
                      className="w-full bg-[var(--bg-graphite)] border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none cursor-pointer font-bold appearance-none"
                      value={editedJob.priority}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, priority: e.target.value })
                      }
                    >
                      <option value="High">Priority Alpha (High)</option>
                      <option value="Medium">Status Beta (Medium)</option>
                      <option value="Low">Base Gamma (Low)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[0.65rem] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium"
                      value={editedJob.labelIndustry}
                      onChange={(e) =>
                        setEditedJob({
                          ...editedJob,
                          labelIndustry: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[0.65rem] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">
                      Used Paper
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium"
                      value={editedJob.usedPaper || ""}
                      onChange={(e) =>
                        setEditedJob({
                          ...editedJob,
                          usedPaper: e.target.value,
                        })
                      }
                      placeholder="e.g. Sona / JK"
                    />
                  </div>
                </div>
              </section>

              <div className="flex flex-col gap-2.5">
                <label className="text-[0.65rem] text-[var(--text-muted)] font-black uppercase tracking-widest ml-1">
                  Notes
                </label>
                <textarea
                  className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-5 rounded-xl focus:border-[var(--primary)] outline-none min-h-[120px] transition-all font-medium resize-none leading-relaxed"
                  value={editedJob.addNotes}
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, addNotes: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 p-5 bg-transparent border-[1.5px] border-[var(--border)] text-white rounded-xl md:rounded-2xl font-bold cursor-pointer hover:bg-white/5 transition-all text-[0.7rem] uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 p-5 rounded-xl md:rounded-2xl font-black text-[0.7rem] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(0,112,255,0.25)]"
                >
                  Save Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default JobCard;
