import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    logout();
    toast.success('Logged out successfully!');
    setShowDropdown(false);
    navigate('/');
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          CipherSQL Studio
        </NavLink>

        <ul className="navbar-nav">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/assignments"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
            >
              Practice
            </NavLink>
          </li>

          {isAuthenticated ? (
            <li className="user-menu" ref={dropdownRef}>
              <button 
                className="user-account-btn"
                onClick={toggleDropdown}
                type="button"
              >
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name">{user?.name}</span>
                <svg 
                  className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="currentColor"
                >
                  <path d="M6 8L2 4h8L6 8z"/>
                </svg>
              </button>
              
              {showDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="dropdown-name">{user?.name}</div>
                        <div className="dropdown-email">{user?.email}</div>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                    type="button"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 13v-2H7V8l-5 4 5 4v-3z"/>
                      <path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? "active" : ""}`
                  }
                >
                  Login
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `navbar-link register-link ${isActive ? "active" : ""}`
                  }
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
