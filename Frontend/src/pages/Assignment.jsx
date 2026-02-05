import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import QueryPanel from "../component/QueryPanel";
import UserProfile from "../component/UserProfile";
import axios from "axios";
import API_CONFIG from "../config/api";
import toast from "react-hot-toast";
import "../styles/Assignment.css";

const Assignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [assignment, setAssignment] = useState(null);
  const [results, setResults] = useState(null);
  const [validation, setValidation] = useState(null);
  const [schemaId, setSchemaId] = useState(null);
  const [tables, setTables] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // Percentage
  const [bottomPanelHeight, setBottomPanelHeight] = useState(40); // Percentage
  const [isResizing, setIsResizing] = useState(false);
  const [isResizingVertical, setIsResizingVertical] = useState(false);
  const [expandedTables, setExpandedTables] = useState({});
  const [hint, setHint] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [loadingHint, setLoadingHint] = useState(false);
  const [userStreak, setUserStreak] = useState(0);
  const [executionMode, setExecutionMode] = useState('run'); // 'run' or 'submit'
  const [testCases, setTestCases] = useState([]);
  const [activeBottomTab, setActiveBottomTab] = useState('testcase'); // Default to testcase tab

  const [expandedHints, setExpandedHints] = useState({});
  const [showProblemList, setShowProblemList] = useState(false);
  const [allProblems, setAllProblems] = useState([]);

  const resultsRef = useRef(null);
  const editorRef = useRef(null);
  const resizeRef = useRef(null);
  const problemListRef = useRef(null);

  useEffect(() => {
    loadAssignment();
    loadAllProblems();
    if (user) {
      updateUserStreak();
    }
    
    // Set default test cases for the testcase tab
    setTestCases([
      { id: 1, status: 'pending', visible: true },
      { id: 2, status: 'pending', visible: true },
      { id: 3, status: 'pending', visible: true }
    ]);

    // Set some default problems if none are loaded after a delay
    const fallbackTimer = setTimeout(() => {
      if (allProblems.length === 0) {
        setAllProblems([
          { _id: 'sql-1', title: 'Select All Employees', difficulty: 'Easy' },
          { _id: 'sql-2', title: 'Join Tables Query', difficulty: 'Medium' },
          { _id: 'sql-3', title: 'Complex Aggregation', difficulty: 'Hard' },
          { _id: 'sql-4', title: 'Subquery Challenge', difficulty: 'Medium' },
          { _id: 'sql-5', title: 'Window Functions', difficulty: 'Hard' }
        ]);
      }
    }, 2000);

    return () => clearTimeout(fallbackTimer);
  }, [id, user]);

  const updateUserStreak = () => {
    if (!user) return;

    const today = new Date().toDateString();
    const storedStreak = localStorage.getItem(`streak_${user.id}`) || '0';
    const storedLastVisit = localStorage.getItem(`lastVisit_${user.id}`);
    
    if (storedLastVisit) {
      const lastVisit = new Date(storedLastVisit).toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastVisit === today) {
        // Already visited today, keep current streak
        setUserStreak(parseInt(storedStreak));
      } else if (lastVisit === yesterdayStr) {
        // Visited yesterday, increment streak
        const newStreak = parseInt(storedStreak) + 1;
        setUserStreak(newStreak);
        localStorage.setItem(`streak_${user.id}`, newStreak.toString());
        localStorage.setItem(`lastVisit_${user.id}`, new Date().toISOString());
      } else {
        // Streak broken, reset to 1
        setUserStreak(1);
        localStorage.setItem(`streak_${user.id}`, '1');
        localStorage.setItem(`lastVisit_${user.id}`, new Date().toISOString());
      }
    } else {
      // First visit
      setUserStreak(1);
      localStorage.setItem(`streak_${user.id}`, '1');
      localStorage.setItem(`lastVisit_${user.id}`, new Date().toISOString());
    }
  };

  // Handle panel resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const container = document.querySelector('.assignment-workspace');
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        
        // Limit width between 30% and 70%
        const clampedWidth = Math.min(Math.max(newWidth, 30), 70);
        setLeftPanelWidth(clampedWidth);
      }
      
      if (isResizingVertical) {
        const rightPanel = document.querySelector('.right-panel');
        if (!rightPanel) return;
        
        const panelRect = rightPanel.getBoundingClientRect();
        const newHeight = ((e.clientY - panelRect.top) / panelRect.height) * 100;
        
        // Limit height between 30% and 80%
        const clampedHeight = Math.min(Math.max(newHeight, 30), 80);
        setBottomPanelHeight(100 - clampedHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsResizingVertical(false);
    };

    if (isResizing || isResizingVertical) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isResizingVertical]);

  const loadAssignment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/sql/assignment/load`,
        {
          assignmentId: id,
          sessionId: `session_${Date.now()}`,
        }
      );

      const { assignment, schemaId, tables = [] } = response.data.data;

      setAssignment(assignment);
      setSchemaId(schemaId);
      setTables(tables);
      
      console.log("Assignment loaded successfully");
    } catch (error) {
      console.error("Error loading assignment:", error);
      const errorMessage = error.response?.data?.error || "Failed to load assignment";
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (error.response?.status === 404) {
        setTimeout(() => {
          navigate('/assignments');
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAllProblems = async () => {
    try {
      console.log('Loading all problems from:', `${API_CONFIG.BASE_URL}/sql/assignments`);
      const response = await axios.get(`${API_CONFIG.BASE_URL}/sql/assignments`);
      if (response.data.success) {
        console.log("Loaded problems:", response.data.data);
        setAllProblems(response.data.data);
      } else {
        console.warn('API response not successful:', response.data);
        setFallbackProblems();
      }
    } catch (error) {
      console.error("Error loading all problems:", error);
      setFallbackProblems();
    }
  };

  const setFallbackProblems = () => {
    // Set some fallback problems if API fails
    const fallbackProblems = [
      { _id: '1', title: 'Find All Customers', difficulty: 'Easy' },
      { _id: '2', title: 'Employee Salary Analysis', difficulty: 'Medium' },
      { _id: '3', title: 'Complex Join Operations', difficulty: 'Hard' }
    ];
    console.log('Setting fallback problems:', fallbackProblems);
    setAllProblems(fallbackProblems);
  };

  const navigateToQuestion = (questionId) => {
    console.log('Navigating to question:', questionId);
    if (questionId && questionId !== id) {
      // Force page reload to ensure proper navigation
      window.location.href = `/assignment/${questionId}`;
    } else {
      console.warn('Invalid question ID or same as current:', questionId);
    }
  };

  const navigateToNextQuestion = () => {
    const currentIndex = allProblems.findIndex(p => p._id === id);
    console.log('Current index:', currentIndex, 'Total problems:', allProblems.length);
    if (currentIndex < allProblems.length - 1) {
      const nextQuestion = allProblems[currentIndex + 1];
      console.log('Navigating to next question:', nextQuestion);
      window.location.href = `/assignment/${nextQuestion._id}`;
    } else {
      console.log('Already at last question');
    }
  };

  const navigateToPrevQuestion = () => {
    const currentIndex = allProblems.findIndex(p => p._id === id);
    console.log('Current index:', currentIndex);
    if (currentIndex > 0) {
      const prevQuestion = allProblems[currentIndex - 1];
      console.log('Navigating to previous question:', prevQuestion);
      window.location.href = `/assignment/${prevQuestion._id}`;
    } else {
      console.log('Already at first question');
    }
  };

  const toggleHint = (hintIndex) => {
    setExpandedHints(prev => ({
      ...prev,
      [hintIndex]: !prev[hintIndex]
    }));
  };

  const toggleProblemList = () => {
    setShowProblemList(!showProblemList);
  };

  // Close problem list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (problemListRef.current && !problemListRef.current.contains(event.target)) {
        setShowProblemList(false);
      }
    };

    if (showProblemList) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProblemList]);

  const executeQuery = async (query, mode = 'run') => {
    if (!query.trim()) {
      toast.error("Please enter a SQL query");
      return;
    }

    try {
      setExecuting(true);
      setExecutionMode(mode);
      
      const executeResponse = await axios.post(
        `${API_CONFIG.BASE_URL}/sql/query/execute`,
        {
          query,
          schemaId,
        }
      );

      const { data: queryResults } = executeResponse.data;
      setResults({ ...queryResults, error: null });

      // Generate test cases based on mode
      if (mode === 'run') {
        // Show only 3 basic test cases for Run - update testcase tab but keep result tab simple
        const basicTestCases = [
          { id: 1, status: queryResults.rows?.length > 0 ? 'passed' : 'failed', visible: true },
          { id: 2, status: queryResults.fields?.length > 0 ? 'passed' : 'failed', visible: true },
          { id: 3, status: queryResults.executionTime < 1000 ? 'passed' : 'failed', visible: true }
        ];
        setTestCases(basicTestCases);
        // For Run mode, switch to testcase tab to show results
        setActiveBottomTab('testcase');
      } else {
        // Show all test cases including hidden ones for Submit
        try {
          const validateResponse = await axios.post(
            `${API_CONFIG.BASE_URL}/sql/query/validate`,
            {
              query,
              assignmentId: assignment._id,
              schemaId,
            }
          );

          const { data: validationResults } = validateResponse.data;
          setValidation(validationResults);
          
          // Generate comprehensive test cases
          const allTestCases = [
            { id: 1, status: queryResults.rows?.length > 0 ? 'passed' : 'failed', visible: true },
            { id: 2, status: queryResults.fields?.length > 0 ? 'passed' : 'failed', visible: true },
            { id: 3, status: queryResults.executionTime < 1000 ? 'passed' : 'failed', visible: true },
            { id: 4, status: validationResults.isCorrect ? 'passed' : 'failed', visible: false },
            { id: 5, status: validationResults.isCorrect ? 'passed' : 'failed', visible: false },
            { id: 6, status: validationResults.isCorrect ? 'passed' : 'failed', visible: false }
          ];
          setTestCases(allTestCases);
          
          if (validationResults.isCorrect) {
            toast.success("🎉 All test cases passed! Well done!");
          } else {
            toast.info("Some test cases failed. Check the results!");
          }
          // For Submit mode, switch to result tab to show comprehensive results
          setActiveBottomTab('result');
        } catch (validationError) {
          console.warn("Validation failed:", validationError);
          setValidation(null);
          // Set basic test cases even if validation fails
          const basicTestCases = [
            { id: 1, status: queryResults.rows?.length > 0 ? 'passed' : 'failed', visible: true },
            { id: 2, status: queryResults.fields?.length > 0 ? 'passed' : 'failed', visible: true },
            { id: 3, status: queryResults.executionTime < 1000 ? 'passed' : 'failed', visible: true }
          ];
          setTestCases(basicTestCases);
          // For Submit mode with validation error, still switch to result tab
          setActiveBottomTab('result');
        }
      }

      // Show results and update active tab
      setShowResults(true);
      // Note: activeBottomTab is set above based on mode
      
    } catch (error) {
      console.error("Error executing query:", error);
      
      const errorMessage = error.response?.data?.error || error.message || "An error occurred while executing the query";
      
      setResults({
        error: errorMessage,
        rows: [],
        fields: [],
        rowCount: 0,
        executionTime: 0
      });
      
      setValidation(null);
      setTestCases([
        { id: 1, status: 'failed', visible: true }
      ]);
      setShowResults(true);
      setActiveBottomTab('testcase'); // Switch to testcase tab on error to show failed test
      
      toast.error("Query execution failed");
    } finally {
      setExecuting(false);
    }
  };

  const retryLoad = () => {
    loadAssignment();
  };

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleVerticalResizeStart = () => {
    setIsResizingVertical(true);
  };

  const scrollToSection = (sectionName) => {
    const element = document.getElementById(`${sectionName}-section`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const toggleTableStructure = (tableIndex) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableIndex]: !prev[tableIndex]
    }));
  };

  const handleGetHint = async () => {
    if (!assignment) return;
    
    setLoadingHint(true);
    try {
      const query = editorRef.current?.getValue?.() || '';
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/hint/assignment/${assignment._id}`,
        {
          userQuery: query
        }
      );

      if (response.data.success) {
        setHint(response.data.hint);
        setShowHint(true);
      }
    } catch (error) {
      console.error('Error getting hint:', error);
      setHint("Unable to get hint at this time. Try breaking down the problem into smaller steps.");
      setShowHint(true);
    } finally {
      setLoadingHint(false);
    }
  };

  if (loading) {
    return (
      <div className="assignment loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignment error">
        <div className="error-container">
          <h2>Failed to Load Assignment</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={retryLoad} className="retry-btn">
              Try Again
            </button>
            <button onClick={() => navigate('/assignments')} className="back-btn">
              Back to Assignments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment">
      {/* Top Navigation Bar */}
      <div className="assignment-navbar">
        <div className="navbar-left">
          <button 
            className="back-btn"
            onClick={() => navigate('/assignments')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div className="problem-nav">
            <div className="problem-list-container" ref={problemListRef}>
              <button 
                className="nav-btn problem-list-btn"
                onClick={toggleProblemList}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
                Problem List
                <svg 
                  className={`dropdown-arrow ${showProblemList ? 'open' : ''}`}
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="currentColor"
                >
                  <path d="M6 8L2 4h8L6 8z"/>
                </svg>
              </button>
              
              {showProblemList && (
                <div className="problem-dropdown">
                  <div className="problem-dropdown-header">
                    <h4>All Problems</h4>
                  </div>
                  <div className="problem-list">
                    {allProblems && allProblems.length > 0 ? (
                      allProblems.map((problem, index) => (
                        <div 
                          key={problem._id}
                          className={`problem-item ${problem._id === id ? 'current' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Clicked on problem:', problem);
                            navigateToQuestion(problem._id);
                          }}
                        >
                          <span className="problem-number">{index + 1}.</span>
                          <span className="problem-title">{problem.title}</span>
                          <span className={`problem-difficulty ${problem.difficulty?.toLowerCase()}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="no-problems">
                        <p>Loading problems...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              className="nav-btn"
              onClick={navigateToPrevQuestion}
              disabled={allProblems.findIndex(p => p._id === id) === 0}
              title="Previous Problem"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            <button 
              className="nav-btn"
              onClick={navigateToNextQuestion}
              disabled={allProblems.findIndex(p => p._id === id) === allProblems.length - 1}
              title="Next Problem"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="navbar-center">
          <div className="center-content">
            {/* Editor Controls */}
            <div className="editor-controls">
              <button 
                className="control-btn run-btn"
                onClick={() => {
                  const query = editorRef.current?.getValue?.();
                  if (query) {
                    executeQuery(query, 'run');
                  }
                }}
                disabled={executing}
                title="Run code"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Run
              </button>
              
              <button 
                className="control-btn submit-btn"
                onClick={() => {
                  const query = editorRef.current?.getValue?.();
                  if (query) {
                    executeQuery(query, 'submit');
                  }
                }}
                disabled={executing}
                title="Submit solution"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Submit
              </button>
            </div>
          </div>
        </div>
        
        <div className="navbar-right">
          {/* Streak Counter */}
          {user && (
            <div className="streak-section">
              <div className="streak-counter" title={`${userStreak} day${userStreak !== 1 ? 's' : ''} streak! Keep it up!`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="streak-icon">
                  <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
                </svg>
                <span className="streak-count">{userStreak}</span>
              </div>
            </div>
          )}
          
          {/* Layout Controls */}
          <div className="layout-controls">
            <button 
              className="layout-btn"
              onClick={() => setLeftPanelWidth(Math.max(leftPanelWidth - 5, 30))}
              title="Decrease left panel width"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13H5v-2h14v2z"/>
              </svg>
            </button>
            <button 
              className="layout-btn"
              onClick={() => setLeftPanelWidth(Math.min(leftPanelWidth + 5, 70))}
              title="Increase left panel width"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
            <button 
              className="layout-btn"
              onClick={() => setLeftPanelWidth(50)}
              title="Reset layout"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </button>
          </div>
          
          {/* Theme Toggle */}
          <div className="theme-controls">
            <button 
              className="theme-btn"
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            >
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
                  </svg>
                )}
            </button>
          </div>
          
          {/* User Profile */}
          <UserProfile />
        </div>
      </div>

      {/* Main Workspace */}
      <div className="assignment-workspace">
        {/* Left Panel - Problem Description */}
        <div 
          className="left-panel"
          style={{ width: `${leftPanelWidth}%` }}
        >
          <div className="panel-tabs">
            <button 
              className={`tab ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab ${activeTab === 'schema' ? 'active' : ''}`}
              onClick={() => setActiveTab('schema')}
            >
              Schema
            </button>
          </div>
          
          <div className="panel-content">
            {activeTab === 'description' ? (
              <div className="problem-description">
                <div className="problem-header">
                  <h2>{assignment?.title}</h2>
                  <div className="problem-meta">
                    <span className={`difficulty ${assignment?.difficulty?.toLowerCase()}`}>
                      {assignment?.difficulty}
                    </span>
                    <button 
                      className="meta-btn topics-btn"
                      onClick={() => scrollToSection('topics')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                      </svg>
                      Topics
                    </button>
                    <button 
                      className="meta-btn companies-btn"
                      onClick={() => scrollToSection('companies')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                      </svg>
                      Companies
                    </button>
                    <button 
                      className="meta-btn hint-btn"
                      onClick={handleGetHint}
                      disabled={loadingHint}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/>
                      </svg>
                      {loadingHint ? 'Loading...' : 'Hint'}
                    </button>
                  </div>
                </div>
                
                {/* AI Hint Panel */}
                {showHint && (
                  <div className="hint-panel">
                    <div className="hint-header">
                      <span>💡 AI Hint</span>
                      <button onClick={() => setShowHint(false)} className="close-hint">×</button>
                    </div>
                    <div className="hint-content">
                      {hint}
                    </div>
                  </div>
                )}
                
                {/* Problem Statement */}
                <div className="problem-section">
                  <div className="problem-content">
                    <p>{assignment?.question}</p>
                  </div>
                </div>

                {/* Example/Test Cases */}
                <div className="problem-section">
                  <h3>Example 1:</h3>
                  <div className="example-content">
                    <div className="example-case">
                      <h4>Input:</h4>
                      <div className="code-block">
                        <pre>Table: {assignment?.sampleTables?.[0]?.tableName || 'employees'}</pre>
                      </div>
                      
                      <h4>Output:</h4>
                      <div className="code-block">
                        <pre>Expected result based on your SQL query</pre>
                      </div>
                      
                      <h4>Explanation:</h4>
                      <p>Write a SQL query to solve this problem using the given table structure.</p>
                    </div>
                  </div>
                </div>

                {/* Constraints */}
                <div className="problem-section">
                  <h3>Constraints:</h3>
                  <ul className="constraints-list">
                    <li>Use standard SQL syntax</li>
                    <li>Query should be efficient and readable</li>
                    <li>Handle edge cases appropriately</li>
                    <li>Follow SQL best practices</li>
                  </ul>
                </div>

                {/* Topics Section */}
                <div className="problem-section" id="topics-section">
                  <h3>Topics</h3>
                  <div className="topic-tags">
                    <span className="topic-tag">Database</span>
                    <span className="topic-tag">SQL</span>
                    <span className="topic-tag">SELECT</span>
                    {assignment?.difficulty?.toLowerCase() === 'medium' && <span className="topic-tag">JOIN</span>}
                    {assignment?.difficulty?.toLowerCase() === 'hard' && <span className="topic-tag">Subquery</span>}
                  </div>
                </div>

                {/* Companies Section */}
                <div className="problem-section" id="companies-section">
                  <h3>Companies</h3>
                  <div className="company-tags">
                    <span className="company-tag">Google</span>
                    <span className="company-tag">Microsoft</span>
                    <span className="company-tag">Amazon</span>
                    <span className="company-tag">Meta</span>
                    <span className="company-tag">Apple</span>
                  </div>
                </div>

                {/* Hints Section */}
                <div className="problem-section" id="hints-section">
                  <h3>Hints</h3>
                  <div className="hints-list">
                    <div className="hint-item">
                      <button 
                        className="hint-toggle"
                        onClick={() => toggleHint(1)}
                      >
                        <h4>Hint 1</h4>
                        <svg 
                          className={`hint-arrow ${expandedHints[1] ? 'open' : ''}`}
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                        >
                          <path d="M7 10l5 5 5-5z"/>
                        </svg>
                      </button>
                      {expandedHints[1] && (
                        <p>Think about which SQL clauses you need to filter and select the data.</p>
                      )}
                    </div>
                    <div className="hint-item">
                      <button 
                        className="hint-toggle"
                        onClick={() => toggleHint(2)}
                      >
                        <h4>Hint 2</h4>
                        <svg 
                          className={`hint-arrow ${expandedHints[2] ? 'open' : ''}`}
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                        >
                          <path d="M7 10l5 5 5-5z"/>
                        </svg>
                      </button>
                      {expandedHints[2] && (
                        <p>Consider using aggregate functions if you need to group or count data.</p>
                      )}
                    </div>
                    <div className="hint-item">
                      <button 
                        className="hint-toggle"
                        onClick={() => toggleHint(3)}
                      >
                        <h4>Hint 3</h4>
                        <svg 
                          className={`hint-arrow ${expandedHints[3] ? 'open' : ''}`}
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                        >
                          <path d="M7 10l5 5 5-5z"/>
                        </svg>
                      </button>
                      {expandedHints[3] && (
                        <p>Pay attention to the table relationships and join conditions if multiple tables are involved.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="schema-view">
                <div className="schema-header">
                  <h3>Database Schema</h3>
                  <p>Tables and their data for this problem</p>
                </div>
                
                <div className="schema-content">
                  {tables && tables.length > 0 ? (
                    tables.map((table, index) => (
                      <div key={index} className="table-schema">
                        <div className="table-header">
                          <h4>{table.tableName}</h4>
                        </div>
                        
                        {/* Table Data Display */}
                        {table.rows && table.rows.length > 0 ? (
                          <div className="table-data">
                            <div className="data-table">
                              <div className="data-header">
                                {Object.keys(table.rows[0]).map((column, colIndex) => (
                                  <div key={colIndex} className="data-col header-col">{column}</div>
                                ))}
                              </div>
                              {table.rows.map((row, rowIndex) => (
                                <div key={rowIndex} className="data-row">
                                  {Object.values(row).map((value, valueIndex) => (
                                    <div key={valueIndex} className="data-col" title={value}>{value}</div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="no-data">
                            <p>No data available for this table</p>
                          </div>
                        )}
                        
                        {/* Table Structure (Collapsible) */}
                        <div className="table-structure-section">
                          <button 
                            className="structure-toggle"
                            onClick={() => toggleTableStructure(index)}
                          >
                            <span>Table Structure</span>
                            <svg className={`chevron ${expandedTables[index] ? 'expanded' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M7 10l5 5 5-5z"/>
                            </svg>
                          </button>
                          
                          {expandedTables[index] && (
                            <div className="table-structure">
                              <div className="columns-header">
                                <span className="col-name">Column</span>
                                <span className="col-type">Type</span>
                                <span className="col-constraints">Constraints</span>
                              </div>
                              
                              {table.columns && table.columns.map((column, colIndex) => (
                                <div key={colIndex} className="column-row">
                                  <span className="col-name">{column.name}</span>
                                  <span className="col-type">{column.type}</span>
                                  <span className="col-constraints">
                                    {column.isPrimaryKey && <span className="constraint primary">PK</span>}
                                    {column.isForeignKey && <span className="constraint foreign">FK</span>}
                                    {column.isNotNull && <span className="constraint not-null">NOT NULL</span>}
                                    {column.isUnique && <span className="constraint unique">UNIQUE</span>}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-schema">
                      <p>No schema information available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resize Handle */}
        <div 
          className="resize-handle horizontal-resize"
          onMouseDown={handleResizeStart}
          ref={resizeRef}
          title="Drag to resize panels"
        >
          <div className="resize-indicator">
            <div className="resize-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor and Results */}
        <div 
          className="right-panel"
          style={{ width: `${100 - leftPanelWidth}%` }}
        >
          {/* Code Editor Area */}
          <div 
            className="editor-area"
            style={{ height: `${100 - bottomPanelHeight}%` }}
          >
            <div className="editor-header">
              <div className="editor-tabs">
                <button className="editor-tab active">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                  </svg>
                  Code
                </button>
              </div>
            </div>
            
            <div className="editor-content">
              <QueryPanel
                onExecute={executeQuery}
                results={results}
                validation={validation}
                resultsRef={resultsRef}
                ref={editorRef}
                assignment={assignment}
                executing={executing}
                editorOnly={true}
              />
            </div>
          </div>

          {/* Vertical Resize Handle */}
          <div 
            className="vertical-resize-handle"
            onMouseDown={handleVerticalResizeStart}
            title="Drag to resize editor and results"
          >
            <div className="resize-indicator vertical">
              <div className="resize-dots horizontal">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          {/* Bottom Panel - Test Results */}
          <div 
            className="bottom-panel"
            style={{ height: `${bottomPanelHeight}%` }}
          >
            <div className="bottom-panel-header">
              <div className="bottom-tabs">
                <button 
                  className={`bottom-tab ${activeBottomTab === 'result' ? 'active' : ''}`}
                  onClick={() => setActiveBottomTab('result')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Test Result
                </button>
                <button 
                  className={`bottom-tab ${activeBottomTab === 'testcase' ? 'active' : ''}`}
                  onClick={() => setActiveBottomTab('testcase')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  Testcase
                </button>
              </div>
            </div>
            
            <div className="bottom-panel-content" ref={resultsRef}>
                {activeBottomTab === 'result' ? (
                  // Test Result Tab - Shows actual query output only for Submit mode
                  <div className="test-results">
                    {executionMode === 'submit' && results ? (
                      <div className="results-display">
                        {results.error ? (
                          <div className="error-result">
                            <h4>Runtime Error</h4>
                            <pre>{results.error}</pre>
                          </div>
                        ) : (
                          <div className="success-result">
                            <div className="result-info">
                              <span>Rows: {results.rowCount}</span>
                              <span>Time: {results.executionTime}ms</span>
                              <span>Mode: Submit</span>
                              {testCases.length > 0 && (
                                <span className={`test-summary ${testCases.filter(tc => tc.status === 'passed').length === testCases.length ? 'all-passed' : 'some-failed'}`}>
                                  {testCases.filter(tc => tc.status === 'passed').length}/{testCases.length} test cases passed
                                </span>
                              )}
                            </div>
                            
                            {/* Show test case results for Submit mode */}
                            {testCases.length > 0 && (
                              <div className="test-cases-summary">
                                <h4>Test Cases</h4>
                                <div className="test-cases-grid">
                                  {testCases.map((testCase, index) => (
                                    <div key={testCase.id} className={`test-case-item ${testCase.status}`}>
                                      <div className="test-case-number">
                                        Case {testCase.id}
                                        {!testCase.visible && <span className="hidden-indicator">Hidden</span>}
                                      </div>
                                      <div className={`test-case-result ${testCase.status}`}>
                                        {testCase.status === 'passed' ? (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                          </svg>
                                        ) : (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 7 9.5 10.5 12 7 14.5 8.5 16 12 13.5 15.5 16 17 14.5 13.5 12 17 9.5 15.5 8z"/>
                                          </svg>
                                        )}
                                        {testCase.status.toUpperCase()}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="no-results">
                        <p>You must submit your code first</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Testcase Tab - Shows detailed test case information
                  <div className="test-cases">
                    {testCases.length > 0 ? (
                      <div className="test-cases-list">
                        {testCases.map((testCase, index) => (
                          <div key={testCase.id} className={`test-case ${testCase.status}`}>
                            <div className="test-case-header">
                              <span className="test-case-title">Case {testCase.id}</span>
                              <div className="test-case-badges">
                                {!testCase.visible && (
                                  <span className="hidden-badge">Hidden</span>
                                )}
                                <span className={`test-case-status ${testCase.status}`}>
                                  {testCase.status === 'passed' ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                  ) : testCase.status === 'failed' ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 7 9.5 10.5 12 7 14.5 8.5 16 12 13.5 15.5 16 17 14.5 13.5 12 17 9.5 15.5 8z"/>
                                    </svg>
                                  ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17h2v-2h-2v2zm1-4c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
                                    </svg>
                                  )}
                                  {testCase.status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            
                            {/* Show query output table only in testcase tab and only for Run mode */}
                            {executionMode === 'run' && results && results.rows && results.rows.length > 0 && (
                              <div className="test-case-content">
                                <div className="query-output">
                                  <h4>Output</h4>
                                  <div className="result-table">
                                    <div className="result-header">
                                      {Object.keys(results.rows[0]).map((col, index) => (
                                        <div key={index} className="result-col">{col}</div>
                                      ))}
                                    </div>
                                    {results.rows.map((row, index) => (
                                      <div key={index} className="result-row">
                                        {Object.values(row).map((value, valueIndex) => (
                                          <div key={valueIndex} className="result-col">{value}</div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-test-cases">
                        <p>Submit your code to see test results.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default Assignment;