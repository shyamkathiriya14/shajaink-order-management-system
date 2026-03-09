import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DownArrow from "../assets/down-arrow.svg";

function AddJob() {
  const [jobNumber, setJobNumber] = useState("Loading...");
  const [clientCompanyName, setClientCompanyName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [labelSize, setLabelSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [labelIndustry, setLabelIndustry] = useState("");
  const [usedPaper, setUsedPaper] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [addNotes, setAddNotes] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const generateJobNumber = async () => {
      try {
        const date = new Date();
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const currentMonthName = monthNames[date.getMonth()];
        const currentYear = date.getFullYear();
        const suffix = `-${currentMonthName}-${currentYear}`;

        const snapshot = await getDocs(collection(db, "jobs"));
        const jobsThisMonth = snapshot.docs
          .map((doc) => doc.data().jobNumber)
          .filter((num) => num && num.endsWith(suffix));

        const nextId = String(jobsThisMonth.length + 1).padStart(2, "0");
        setJobNumber(`${nextId}${suffix}`);
      } catch (error) {
        setJobNumber("ERR-GEN");
      }
    };
    generateJobNumber();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientCompanyName || !clientName || !labelSize || !quantity) {
      toast.warn("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        // Limit check for Firestore (1MB document limit)
        if (imageFile.size > 700 * 1024) {
          toast.error(
            "Image is too large. Please use an image smaller than 700KB.",
          );
          setIsSubmitting(false);
          return;
        }

        console.log("Converting image to Base64...", imageFile.name);
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            console.log("Image converted to Base64 successfully.");
            resolve(reader.result);
          };
          reader.onerror = (error) => {
            console.error("Conversion failed:", error);
            reject(new Error("Failed to process image file."));
          };
          reader.readAsDataURL(imageFile);
        });
      }

      await addDoc(collection(db, "jobs"), {
        jobNumber,
        clientCompanyName,
        clientName,
        clientPhone,
        clientEmail,
        clientAddress,
        labelSize,
        quantity,
        labelIndustry,
        usedPaper,
        status: "Pending",
        priority,
        addNotes,
        imageUrl,
        createdAt: new Date().toISOString(),
      });

      toast.success("Job added successfully.");
      navigate("/");
    } catch (error) {
      toast.error(`Failed to add job: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-entry sm:px-4 md:px-10 lg:px-20 pt-[100px] md:pt-[140px] pb-10 max-w-[1000px] mx-auto">
      <div className="glass-card p-6 md:p-15 bg-[#020619]/60">
        <header className="mb-10 md:mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 md:mb-4 tracking-tight">
            Add New <span className="blue-gradient-text">Job</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base md:text-lg font-medium">
            Fill in the details below to create a new job
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:gap-12">
          <section>
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary-glow)]"></div>
              <h4 className="text-[0.7rem] md:text-[0.75rem] text-white uppercase tracking-[0.2em] font-black">
                Client Information
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                  Job Number (Auto)
                </label>
                <input
                  type="text"
                  value={jobNumber}
                  readOnly
                  className="w-full bg-white/5 border-[1.5px] border-dashed border-[var(--primary)] text-[var(--primary)] p-4 rounded-xl font-black outline-none transition-all cursor-default"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={clientCompanyName}
                  onChange={(e) => setClientCompanyName(e.target.value)}
                  placeholder="Enter a Company Name"
                  className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium placeholder:text-[var(--text-muted)]/30"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter a Client Name"
                  required
                  className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium placeholder:text-[var(--text-muted)]/30"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+91 9999999999"
                  className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium placeholder:text-[var(--text-muted)]/30"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="connect@xyz.com"
                  className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium placeholder:text-[var(--text-muted)]/30"
                />
              </div>
              <div className="flex flex-col gap-2.5 md:col-span-2">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                  Address
                </label>
                <textarea
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Full Address Details"
                  className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium placeholder:text-[var(--text-muted)]/30 resize-none h-[100px]"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]"></div>
              <h4 className="text-[0.7rem] md:text-[0.75rem] text-white uppercase tracking-[0.2em] font-black">
                Job Specifications
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                  Label Size
                </label>
                <input
                  type="text"
                  value={labelSize}
                  onChange={(e) => setLabelSize(e.target.value)}
                  placeholder="100x50 mm/inch"
                  required
                  className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium placeholder:text-[var(--text-muted)]/30"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                  Quantity
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="5000 pcs/Rolls"
                  required
                  className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium placeholder:text-[var(--text-muted)]/30"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                  Priority
                </label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-[var(--bg-graphite)] border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none cursor-pointer font-bold appearance-none transition-all"
                  >
                    <option value="High">Heigh Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                  <img
                    className="absolute top-1/2 right-[18px] w-[14px] h-auto -translate-y-1/2"
                    src={DownArrow}
                    alt="DownArrow"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={labelIndustry}
                  onChange={(e) => setLabelIndustry(e.target.value)}
                  placeholder="Pharma / FMCG"
                  className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium placeholder:text-[var(--text-muted)]/30"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                  Used Paper
                </label>
                <input
                  type="text"
                  value={usedPaper}
                  onChange={(e) => setUsedPaper(e.target.value)}
                  placeholder="Tharmal / Chromo / PET / BOPP"
                  className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-4 rounded-xl focus:border-[var(--primary)] outline-none transition-all font-medium placeholder:text-[var(--text-muted)]/30"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-2 h-2 rounded-full bg-[var(--success)] shadow-[0_0_10px_var(--success-glow)]"></div>
              <h4 className="text-[0.7rem] md:text-[0.75rem] text-white uppercase tracking-[0.2em] font-black">
                Attachments
              </h4>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2.5">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                  Client Requirement & Notes
                </label>
                <textarea
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  placeholder="Enter Client Specific Requirements"
                  className="w-full bg-white/5 border-[1.5px] border-[var(--border)] text-white p-5 rounded-xl focus:border-[var(--primary)] outline-none min-h-[120px] md:min-h-[150px] transition-all font-medium resize-none leading-relaxed placeholder:text-[var(--text-muted)]/30"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[0.65rem] md:text-[0.7rem] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                  Job Image
                </label>
                <div className="relative group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="p-8 md:p-12 border-2 border-dashed border-[var(--border)] rounded-2xl md:rounded-3xl text-center bg-white/[0.01] group-hover:bg-white/[0.03] group-hover:border-[var(--primary)] transition-all">
                    <span className="text-4xl md:text-5xl block mb-4 opacity-40 group-hover:scale-110 transition-transform">
                      📸
                    </span>
                    <p className="text-[var(--text-muted)] font-medium text-sm md:text-base">
                      Click or drag to upload image
                    </p>
                    <p className="text-[0.6rem] md:text-[0.65rem] text-[var(--text-muted)] uppercase tracking-widest mt-2">
                      Supports JPG, PNG, WEBP
                    </p>
                  </div>
                  {imageFile && (
                    <div className="mt-4 p-4 glass-card border-[rgba(34,197,94,0.3)] bg-green-500/5 flex items-center justify-between">
                      <span className="text-green-500 text-xs md:text-sm font-bold flex items-center gap-2">
                        <span className="text-lg">✓</span> FILE LOGGED:{" "}
                        {imageFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setImageFile(null)}
                        className="text-white opacity-40 hover:opacity-100 text-lg"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-5 md:py-6 text-base md:text-lg font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(0,112,255,0.3)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <span className="relative z-10">
              {isSubmitting
                ? imageFile
                  ? "Processing Image..."
                  : "Adding Job..."
                : "Add Job"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddJob;
