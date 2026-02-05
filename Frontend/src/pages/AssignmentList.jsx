import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_CONFIG from "../config/api";
import toast from "react-hot-toast";
import "../styles/AssignmentList.css";

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const difficultyLevels = [
    { value: "all", label: "All Difficulties", count: 0 },
    { value: "easy", label: "Easy", count: 0 },
    { value: "medium", label: "Medium", count: 0 },
    { value: "hard", label: "Hard", count: 0 }
  ];

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_CONFIG.BASE_URL}/assignment`);
      const assignmentData = response.data.allAssignment || [];
      
      setAssignments(assignmentData);
      setFilteredAssignments(assignmentData);
      
      // Only log to console, no toast notification
      console.log(`Loaded ${assignmentData.length} assignments`);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      const errorMessage = error.response?.data?.error || "Failed to load assignments";
      setError(errorMessage);
      // Only show toast for errors, not success
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filterAssignments = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setDropdownOpen(false);
    
    if (difficulty === "all") {
      setFilteredAssignments(assignments);
    } else {
      const filtered = assignments.filter(
        assignment => assignment.difficulty.toLowerCase() === difficulty
      );
      setFilteredAssignments(filtered);
    }
  };

  const getDifficultyStats = () => {
    const stats = { all: assignments.length, easy: 0, medium: 0, hard: 0 };
    
    assignments.forEach(assignment => {
      const difficulty = assignment.difficulty.toLowerCase();
      if (stats.hasOwnProperty(difficulty)) {
        stats[difficulty]++;
      }
    });
    
    return stats;
  };

  const getAcceptanceRate = () => {
    // Mock acceptance rate for demo - in real app this would come from backend
    return Math.floor(Math.random() * 40) + 30; // Random between 30-70%
  };

  const getSelectedDifficultyLabel = () => {
    const selected = difficultyLevels.find(level => level.value === selectedDifficulty);
    return selected ? selected.label : "All Difficulties";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const difficultyStats = getDifficultyStats();

  if (loading) {
    return (
      <div className="assignment-list loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignment-list error">
        <div className="error-container">
          <h2>Failed to Load Assignments</h2>
          <p>{error}</p>
          <button onClick={fetchAssignments} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-list">
      <div className="assignment-header">
        <div className="header-content">
          <h1>SQL Practice Problems</h1>
          <p className="header-description">
            Solve SQL problems to improve your database skills
          </p>
        </div>
      </div>

      <div className="assignment-content">
        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-controls">
            <label className="filter-label">Filter by difficulty:</label>
            <div className="dropdown-container" ref={dropdownRef}>
              <button
                className="dropdown-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                type="button"
              >
                <span className="dropdown-text">{getSelectedDifficultyLabel()}</span>
                <svg 
                  className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {difficultyLevels.map(level => (
                    <button
                      key={level.value}
                      className={`dropdown-item ${selectedDifficulty === level.value ? 'active' : ''}`}
                      onClick={() => filterAssignments(level.value)}
                      type="button"
                    >
                      <span className="dropdown-item-label">{level.label}</span>
                      <span className="dropdown-item-count">
                        ({difficultyStats[level.value] || 0})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assignment Table */}
        <div className="assignments-table">
          <div className="table-header">
            <div className="col-status">Status</div>
            <div className="col-title">Title</div>
            <div className="col-acceptance">Acceptance</div>
            <div className="col-difficulty">Difficulty</div>
            <div className="col-actions">Actions</div>
          </div>

          <div className="table-body">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment, index) => (
                <div key={assignment._id} className="assignment-row">
                  <div className="col-status">
                    <div className="status-indicator completed">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="col-title">
                    <Link to={`/assignment/${assignment._id}`} className="assignment-link">
                      <span className="assignment-number">{index + 1}.</span>
                      <span className="assignment-title">{assignment.title}</span>
                    </Link>
                  </div>
                  
                  <div className="col-acceptance">
                    <span className="acceptance-rate">{getAcceptanceRate()}%</span>
                  </div>
                  
                  <div className="col-difficulty">
                    <span className={`difficulty-tag ${assignment.difficulty.toLowerCase()}`}>
                      {assignment.difficulty}
                    </span>
                  </div>
                  
                  <div className="col-actions">
                    <Link 
                      to={`/assignment/${assignment._id}`} 
                      className="solve-btn"
                    >
                      Solve
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-assignments">
                <div className="no-assignments-content">
                  <h3>No assignments found</h3>
                  <p>No assignments match the selected difficulty level.</p>
                  <button 
                    onClick={() => filterAssignments("all")} 
                    className="btn-secondary"
                  >
                    Show All Assignments
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentList;
