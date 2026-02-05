import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import AssignmentHeader from "../component/AssignmentHeader";
import Sidebar from "../component/Sidebar";
import QueryPanel from "../component/QueryPanel";
import axios from "axios";
import API_CONFIG from "../config/api";
import "../styles/Assignment.css";

const Assignment = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [results, setResults] = useState(null);
  const [validation, setValidation] = useState(null);
  const [schemaId, setSchemaId] = useState(null);
  const [tables, setTables] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [previousShowResults, setPreviousShowResults] = useState(false);

  const resultsRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    loadAssignment();
  }, [id]);

  useEffect(() => {
  
    if (showResults && !previousShowResults && resultsRef.current) {
      const timeoutId = setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
    
  
    if (showResults !== previousShowResults) {
      setPreviousShowResults(showResults);
    }
  }, [showResults, previousShowResults]);

  const loadAssignment = async () => {
    try {
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
    } catch (error) {
      console.log("Error loading assignment", error);
    }
  };

  const executeQuery = async (query) => {
    try {
      const executeResponse = await axios.post(
        `${API_CONFIG.BASE_URL}/sql/query/execute`,
        {
          query,
          schemaId,
        }
      );

      const { data: queryResults } = executeResponse.data;
      
   
      setResults({ ...queryResults, error: null });

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

      
      setShowResults(true);
      
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 150);
      
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
   
      setShowResults(true);
      
    
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 150);
    }
  };

  const toggleResults = () => {
    setShowResults(!showResults);
  };

  return (
    <div className="assignment">
      {assignment && (
        <>
          <AssignmentHeader assignment={assignment} />

          <div className="content">
            <Sidebar assignment={assignment} tables={tables} />
            <QueryPanel
              onExecute={executeQuery}
              results={results}
              validation={validation}
              showResults={showResults}
              onToggleResults={toggleResults}
              resultsRef={resultsRef}
              editorRef={editorRef}
              assignment={assignment}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Assignment;
