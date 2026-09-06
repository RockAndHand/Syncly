import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BsLightningChargeFill } from "react-icons/bs";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevents page reload

    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      setSuccess(true);
      // Automatically redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
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
          <h2>Create an account</h2>
          <p>Join Syncly and chat differently</p>
        </div>

        {/* Dynamic Context Feedback Banners */}
        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div className="auth-success">
            Registered successfully! Redirecting to login...
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="rahul or something?"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading || success}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || success}
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
              disabled={loading || success}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading || success}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Navigation Helper */}
        <p className="auth-footer">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </div>
      
    </div>
  );
}

export default Register;
