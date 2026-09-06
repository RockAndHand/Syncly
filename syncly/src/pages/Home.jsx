import { Link } from "react-router-dom";
import {
  BsLightningChargeFill,
  BsShieldCheck,
  BsChatSquareHeart,
} from "react-icons/bs";
import { FiArrowRight, FiActivity } from "react-icons/fi";
import "./Home.css";

function Home() {
  return (
    <div className="landing-wrapper">
      {/* Dynamic Animated Ambient Background Glows */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {/* Navigation Header */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <BsLightningChargeFill className="logo-bolt" />
          <span>Syncly</span>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="nav-link-btn minor">
            Sign In
          </Link>
          <Link to="/register" className="nav-link-btn major">
            Get Started <FiArrowRight />
          </Link>
        </div>
      </nav>

      {/* Hero Interactive Canvas */}
      <header className="hero-section">
        <div className="badge-announcement">
          <span className="badge-tag">New</span>
          <span className="badge-text">
            Engine upgraded to ultra-low latency WebSockets.
          </span>
        </div>

        <h1 className="hero-title">
          Chat Differently.
          <br />
          <span className="gradient-text">Sync Instantly.</span>
        </h1>

        <p className="hero-subtitle">
          Experience real-time conversation wrapped in a fluid, frosted glass
          interface. Built for speed, styled for comfort.
        </p>

        <div className="hero-cta-group">
          <Link to="/register" className="cta-btn primary">
            Create Free Account <FiArrowRight />
          </Link>
          <Link to="/login" className="cta-btn secondary">
            Launch Workspace
          </Link>
        </div>
      </header>

      {/* Staggered Animated Feature Cards */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="icon-wrapper purple">
            <FiActivity size={24} />
          </div>
          <h3>Fluid Mechanics</h3>
          <p>
            Live debounced typing indicators and instantaneous optimistic UI
            rendering keep your streams moving effortlessly.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-wrapper blue">
            <BsShieldCheck size={24} />
          </div>
          <h3>Token Isolation</h3>
          <p>
            Secure authentication layers keeping state and credentials strictly
            contained and safely routed across active sessions.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-wrapper pink">
            <BsChatSquareHeart size={24} />
          </div>
          <h3>Asymmetrical Design</h3>
          <p>
            A beautifully configured squircle-based structural architecture
            optimized specifically for dark aesthetic layouts.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
