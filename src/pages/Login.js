import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true");
      toast.success("Login Successful!");
      navigate("/");
    } else {
      toast.error("Invalid Username or Password!");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100%", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "#020617",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Mesh Animation */}
      <div className="mesh-gradient" style={{ opacity: 0.4 }}></div>

      <div className="glass-card" style={{ 
        width: "90%", 
        maxWidth: "450px", 
        padding: "60px 40px", 
        borderRadius: "32px",
        position: "relative",
        zIndex: 10,
        animation: "fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)"
      }}>
        {/* Brand Icon */}
        <div style={{ 
          width: "60px", 
          height: "60px", 
          background: "linear-gradient(135deg, var(--primary), var(--accent))", 
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          color: "#fff",
          fontSize: "2rem",
          margin: "0 auto 32px",
          boxShadow: "0 0 30px var(--primary-glow)"
        }}>S</div>

        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "12px", 
          fontSize: "2.2rem", 
          fontWeight: 800, 
          color: "#fff",
          letterSpacing: "-0.04em"
        }}>Welcome Back</h2>
        
        <p style={{ 
          textAlign: "center", 
          color: "var(--text-muted)", 
          marginBottom: "48px",
          fontSize: "1.1rem",
          fontWeight: 500
        }}>Enter your credentials to access the console</p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.15em" }}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="admin"
              style={{ 
                padding: "18px 24px", 
                borderRadius: "16px", 
                border: "1.5px solid var(--border)",
                background: "rgba(255,255,255,0.03)",
                color: "#fff",
                fontSize: "1rem",
                transition: "var(--transition)"
              }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.15em" }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              style={{ 
                padding: "18px 24px", 
                borderRadius: "16px", 
                border: "1.5px solid var(--border)",
                background: "rgba(255,255,255,0.03)",
                color: "#fff",
                fontSize: "1rem",
                transition: "var(--transition)"
              }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            style={{ 
              padding: "20px", 
              borderRadius: "16px", 
              fontSize: "1rem",
              fontWeight: 800,
              marginTop: "12px",
              boxShadow: "0 20px 40px rgba(0, 112, 255, 0.2)"
            }}
          >
            AUTHORIZE ACCESS
          </button>
        </form>

        <div style={{ marginTop: "40px", textAlign: "center", fontSize: "0.85rem", color: "rgba(255,255,255,0.2)", fontWeight: 600, letterSpacing: "0.05em" }}>
          SECURED BY SAHAJINK ENCRYPTION
        </div>
      </div>
    </div>
  );
}

export default Login;
