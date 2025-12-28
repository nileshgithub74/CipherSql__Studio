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

  const resultsRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    loadAssignment();
  }, [id]);

  useEffect(() => {
    if (showResults && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else if (!showResults && editorRef.current) {
      setTimeout(() => {
        editorRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [showResults]);

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
      setResults(queryResults);

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
    } catch (error) {
      console.log("Error executing query:", error);
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
