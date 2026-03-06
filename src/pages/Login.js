import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Static predefined username and password
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true");
      toast.success("Login Successful!");
      navigate("/"); // Redirect to home page after login
    } else {
      toast.error("Invalid Username or Password!");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "30px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login to Order Management</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Enter username (admin)"
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            required
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password (admin123)"
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            required
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            padding: "12px", 
            backgroundColor: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer", 
            marginTop: "10px",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
