import { useState, useEffect } from "react";
import { db, storage } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonthName = monthNames[date.getMonth()];
        const currentYear = date.getFullYear();
        const suffix = `-${currentMonthName}-${currentYear}`;

        const snapshot = await getDocs(collection(db, "jobs"));
        const jobsThisMonth = snapshot.docs
          .map(doc => doc.data().jobNumber)
          .filter(num => num && num.endsWith(suffix));

        const nextId = String(jobsThisMonth.length + 1).padStart(2, '0');
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
        const storageRef = ref(storage, `job-images/${jobNumber}_${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        imageUrl = await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            }, 
            (error) => reject(error), 
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => resolve(downloadURL));
            }
          );
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
        quantity: Number(quantity),
        labelIndustry,
        status: "Pending", 
        priority, 
        addNotes,
        imageUrl,
        createdAt: new Date().toISOString()
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
    <div className="page-entry" style={{ padding: "140px 20px 60px", maxWidth: "900px", margin: "0 auto" }}>
      <div className="glass-card" style={{ padding: "60px", background: "rgba(15, 23, 42, 0.4)" }}>
        <header style={{ marginBottom: "48px", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, color: "#fff", marginBottom: "16px", letterSpacing: "-0.04em" }}>
            Add <span style={{ color: "var(--primary)", textShadow: "0 0 30px var(--primary-glow)" }}>New Job</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", fontWeight: 500 }}>Register a new order into Sahajink</p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "24px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)", boxShadow: "0 0 10px var(--primary-glow)" }}></span>
              <h4 style={{ margin: 0, color: "#fff", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em" }}>Client Details</h4>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Job Number</label>
                <input type="text" value={jobNumber} readOnly style={{ background: "rgba(255,255,255,0.02)", color: "var(--primary)", fontWeight: 900, borderStyle: "dashed" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Client Company</label>
                <input type="text" value={clientCompanyName} onChange={(e) => setClientCompanyName(e.target.value)} placeholder="e.g. Acme Corp" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Contact Person</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Full Name" required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Phone Number</label>
                <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+91 ..." />
              </div>
            </div>
          </section>

          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "24px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent-glow)" }}></span>
              <h4 style={{ margin: 0, color: "#fff", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em" }}>Specifications</h4>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Label Size</label>
                <input type="text" value={labelSize} onChange={(e) => setLabelSize(e.target.value)} placeholder="e.g. 100x50mm" required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Quantity</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Units" required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Industry</label>
                <input type="text" value={labelIndustry} onChange={(e) => setLabelIndustry(e.target.value)} placeholder="Pharma / FMCG" />
              </div>
            </div>
          </section>

          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "24px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 10px var(--success-glow)" }}></span>
              <h4 style={{ margin: 0, color: "#fff", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em" }}>Documentation</h4>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Notes</label>
                <textarea value={addNotes} onChange={(e) => setAddNotes(e.target.value)} placeholder="Special instructions..." style={{ minHeight: "120px" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Design Image</label>
                <div style={{ padding: "40px", border: "2px dashed var(--border)", borderRadius: "20px", textAlign: "center", background: "rgba(255,255,255,0.01)", transition: "var(--transition)" }} onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--primary)"} onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border)"}>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ color: "var(--text-muted)" }} />
                  {imageFile && <p style={{ fontSize: "0.9rem", color: "var(--success)", fontWeight: 800, marginTop: "15px" }}>SELECTED: {imageFile.name}</p>}
                </div>
              </div>
            </div>
          </section>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary"
            style={{ 
              padding: "24px", 
              fontSize: "1.1rem", 
              marginTop: "20px",
              boxShadow: isSubmitting ? "none" : "0 20px 40px var(--primary-glow)"
            }}
          >
            {isSubmitting ? `UPLOADING (${Math.round(uploadProgress)}%)...` : "ADD JOB"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddJob;
