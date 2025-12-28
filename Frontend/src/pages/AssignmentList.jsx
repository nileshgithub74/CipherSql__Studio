import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_CONFIG from "../config/api";
import "../styles/AssignmentList.css";

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);

 



  const fetchAssignments = async () => {
    const response = await axios.get(`${API_CONFIG.BASE_URL}/assignment`);
    setAssignments(response.data.allAssignment || []);
  };


   useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="assignment-list">
      <h1>SQL Assignments</h1>
      <p>Choose an assignment to start practicing</p>
      
      {assignments.map((assignment) => (
        <div key={assignment._id} className="card">
          <h3>{assignment.title}</h3>
          <span className={assignment.difficulty.toLowerCase()}>{assignment.difficulty}</span>
          <p>{assignment.description}</p>
          <span className="time">⏱️ 10 min</span>
          <Link to={`/assignment/${assignment._id}`}>Start</Link>
        </div>
      ))}
    </div>
  );
};

export default AssignmentList;