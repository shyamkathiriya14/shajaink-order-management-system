import { useState, useEffect } from "react";
import { db, storage } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  const navigate = useNavigate();

  // Generate automated Job Number on mount
  useEffect(() => {
    const generateJobNumber = async () => {
      try {
        const date = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonthName = monthNames[date.getMonth()];
        const currentYear = date.getFullYear();

        const suffix = `-${currentMonthName}-${currentYear}`;

        // Fetch all jobs to count how many exist for THIS month
        const snapshot = await getDocs(collection(db, "jobs"));
        const jobsThisMonth = snapshot.docs
          .map(doc => doc.data().jobNumber)
          .filter(num => num && num.endsWith(suffix));

        // Format to minimum 2 digits (01, 02, etc)
        const nextId = String(jobsThisMonth.length + 1).padStart(2, '0');
        
        setJobNumber(`${nextId}${suffix}`);
      } catch (error) {
        console.error("DEBUG: Error generating job number", error);
        setJobNumber("Error-Generating");
      }
    };

    generateJobNumber();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("DEBUG: Submit started");

    if (!jobNumber || jobNumber === "Loading..." || jobNumber.startsWith("Error") || !clientCompanyName || !clientName || !labelSize || !quantity) {
      toast.warn("Please wait for Job Number to generate and fill all fields!");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = "";

      // 1. Upload image if selected
      if (imageFile) {
        console.log("DEBUG: Staring image upload...", imageFile.name);
        try {
          const fileRef = ref(storage, `job-images/${jobNumber}_${imageFile.name}`);
          const uploadResult = await uploadBytes(fileRef, imageFile);
          console.log("DEBUG: Upload success", uploadResult);
          imageUrl = await getDownloadURL(fileRef);
          console.log("DEBUG: Image URL retrieved", imageUrl);
        } catch (uploadError) {
          console.error("DEBUG: IMAGE UPLOAD FAILED", uploadError);
          toast.error("Image upload fail ho gaya! Kripya storage rules check karein.");
          setIsSubmitting(false);
          return; // Stop if image upload fails
        }
      }

      // 2. Save to Firestore
      console.log("DEBUG: Adding document to Firestore...");
      const docData = {
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
      };

      const docRef = await addDoc(collection(db, "jobs"), docData);
      console.log("DEBUG: Document added with ID", docRef.id);
      
      toast.success("Job added successfully!");
      navigate("/"); 
    } catch (error) {
      console.error("DEBUG: GENERAL ERROR SAVING JOB", error);
      toast.error("Error adding job! Console check karein.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Add New Job</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Job Number (Auto-Generated):</label>
          <input 
            type="text" 
            value={jobNumber} 
            readOnly
            style={{ padding: "8px", backgroundColor: "#e9ecef", cursor: "not-allowed", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Client Company Name:</label>
          <input 
            type="text" 
            value={clientCompanyName} 
            onChange={(e) => setClientCompanyName(e.target.value)} 
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Client Name:</label>
          <input 
            type="text" 
            value={clientName} 
            onChange={(e) => setClientName(e.target.value)} 
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Client Phone Number:</label>
          <input 
            type="tel" 
            value={clientPhone} 
            onChange={(e) => setClientPhone(e.target.value)} 
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Client Email:</label>
          <input 
            type="email" 
            value={clientEmail} 
            onChange={(e) => setClientEmail(e.target.value)} 
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Client Address:</label>
          <textarea 
            value={clientAddress} 
            onChange={(e) => setClientAddress(e.target.value)} 
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "60px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Label Size:</label>
          <input 
            type="text" 
            value={labelSize} 
            onChange={(e) => setLabelSize(e.target.value)} 
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Label Quantity:</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Label Industry:</label>
          <input 
            type="text" 
            value={labelIndustry} 
            onChange={(e) => setLabelIndustry(e.target.value)} 
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Job Priority:</label>
          <select 
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Add Notes:</label>
          <textarea 
            value={addNotes} 
            onChange={(e) => setAddNotes(e.target.value)} 
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Label Design Image (Optional):</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])} 
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: "10px", 
            backgroundColor: "#28a745", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            marginTop: "10px"
          }}
        >
          {isSubmitting ? "Adding Job..." : "Add Job"}
        </button>
      </form>
    </div>
  );
}

export default AddJob;
