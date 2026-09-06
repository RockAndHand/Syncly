import { useEffect, useState, useRef } from "react";
import { FiSliders, FiChevronDown } from "react-icons/fi";

function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("syncly-dark");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const themes = [
    { id: "syncly-dark", name: "Default Glow" },
    { id: "cyber-punk", name: "Neo Tokyo" },
    { id: "monochrome", name: "Minimalist" },
    { id: "glass-acid", name: "Liquid Lime" },
    { id: "y2k-pink", name: "Y2K Glitch" },
    { id: "tokyo-drift", name: "Tokyo Drift" },
    { id: "solaris-wave", name: "Solaris Wave" },
  ];
  useEffect(() => {
    document.body.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  // Close the dropdown dynamically if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentThemeName =
    themes.find((t) => t.id === currentTheme)?.name || "Select Vibe";

  return (
    <div className="theme-switcher-box" ref={dropdownRef}>
      <div className="theme-label">
        <FiSliders size={12} />
        <span>Vibe Check</span>
      </div>

      <div className="custom-dropdown">
        {/* Trigger Button */}
        <button
          className={`dropdown-trigger ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{currentThemeName}</span>
          <FiChevronDown className={`chevron-icon ${isOpen ? "rotate" : ""}`} />
        </button>

        {/* Floating Menu List */}
        {isOpen && (
          <div className="dropdown-menu">
            {themes.map((theme) => (
              <button
                key={theme.id}
                className={`dropdown-item ${currentTheme === theme.id ? "selected" : ""}`}
                onClick={() => {
                  setCurrentTheme(theme.id);
                  setIsOpen(false); // Snap shut on choice
                }}
              >
                {theme.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ThemeSwitcher;
