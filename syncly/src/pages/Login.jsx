import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BsLightningChargeFill } from "react-icons/bs";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    // Prevent standard page reload on form submission
    e.preventDefault(); 
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/chat");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Branding Headers */}
        <div className="auth-header">
          <div className="auth-logo">
            <BsLightningChargeFill />
            <span>Syncly</span>
          </div>
          <h2>Welcome back</h2>
          <p>Log in to your account to continue</p>
        </div>

        {/* Error Notification Block */}
        {error && <div className="auth-error">{error}</div>}

        {/* Semantic Form Layout */}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Navigation Helper */}
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
      
    </div>
  );
}

export default Login;