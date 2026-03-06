import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-12 mb-8 animate-fade-in">
      <div className="flex items-center gap-2 p-1.5 glass-card bg-slate-900/40 border-white/5 shadow-xl rounded-2xl">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-3 rounded-xl text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          title="Previous Page"
        >
          <span className="text-xl">←</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`min-w-[45px] h-[45px] rounded-xl text-sm font-black transition-all duration-300 ${
                currentPage === num
                  ? "bg-[var(--primary)] text-white shadow-[0_0_20px_var(--primary-glow)] scale-110"
                  : "text-[var(--text-muted)] hover:text-white hover:bg-white/5"
              }`}
            >
              {String(num).padStart(2, "0")}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-3 rounded-xl text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          title="Next Page"
        >
          <span className="text-xl">→</span>
        </button>
      </div>

      <p className="text-[var(--text-muted)] text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-40">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}

export default Pagination;
