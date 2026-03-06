import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import JobCard from "../components/JobCard";

function Home(){

  const [jobs,setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

useEffect(()=>{

const fetchJobs = async ()=>{

const querySnapshot = await getDocs(collection(db,"jobs"));

const list = querySnapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

setJobs(list);

}

fetchJobs();

},[])   // ❗ IMPORTANT (empty dependency)

  const handleDelete = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };
  
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      (job.jobNumber && job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.clientName && job.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.clientCompanyName && job.clientCompanyName.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = filterStatus === "All" || job.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return(
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
        <h2 style={{ margin: 0 }}>All Jobs</h2>
        
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input 
            type="text" 
            placeholder="Search by Job ID or Client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", width: "250px" }}
          />
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="All">All Statuses ({jobs.length})</option>
            <option value="Pending">Pending ({jobs.filter(job => job.status === "Pending").length})</option>
            <option value="Upcoming">Upcoming ({jobs.filter(job => job.status === "Upcoming").length})</option>
            <option value="Running">Running ({jobs.filter(job => job.status === "Running").length})</option>
            <option value="Completed">Completed ({jobs.filter(job => job.status === "Completed").length})</option>
          </select>
        </div>
      </div>
      
      {filteredJobs.length > 0 ? (
        filteredJobs.map(job => (
          <JobCard key={job.id} job={job} onDelete={handleDelete} />
        ))
      ) : (
        <p style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>No jobs found matching your search.</p>
      )}
    </div>
  )

}

export default Home;