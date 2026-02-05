import {
  createWorkspace,
  loadAssignmentData,
  executeUserQuery,
  getSchemaInfo,
  getTableData,
  pool,
} from "../database/postgresql.js";
import { validateAnswer } from "../services/answerValidationService.js";
import Assignment from "../models/assignmentModel.js";



export const loadAssignment = async (req, res) => {
  let client;
  try {
    const { assignmentId, sessionId } = req.body;

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        error: "Assignment ID is required",
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: "Assignment not found",
      });
    }

    const { _id, title, question, difficulty, sampleTables } = assignment;

    const { schemaId, client: workspaceClient } = await createWorkspace(sessionId);
    client = workspaceClient;

    await loadAssignmentData(client, schemaId, sampleTables);

    const schemaInfo = await getSchemaInfo(client, schemaId);

    const tableData = await getTableData(client, schemaId);

    client.release();
    client = null;

    console.log("Assignment loaded successfully");
    res.json({
      success: true,
      data: {
        schemaId,
        assignment: { _id, title, question, difficulty },
        schema: schemaInfo,
        tables: tableData,
      },
    });
  } catch (error) {
    console.error("Error in loadAssignment:", error);
    if (client) {
      client.release();
    }
    res.status(500).json({
      success: false,
      error: error.message || "Failed to load assignment",
    });
  }
};


export const executeQuery = async (req, res) => {
  let client;
  try {
    const { query, schemaId } = req.body;

    if (!query || !schemaId) {
      return res.status(400).json({
        success: false,
        error: "Query and schema ID are required",
      });
    }

    client = await pool.connect();
    const result = await executeUserQuery(client, schemaId, query);
    client.release();
    client = null;

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error executing query:", error);
    if (client) {
      client.release();
    }
    res.status(500).json({
      success: false,
      error: error.message || "Failed to execute query",
    });
  }
};

export const validateUserAnswer = async (req, res) => {
  try {
    const { query, assignmentId, schemaId } = req.body;

    if (!query || !assignmentId || !schemaId) {
      return res.status(400).json({
        success: false,
        error: "Query, assignment ID, and schema ID are required",
      });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: "Assignment not found",
      });
    }

    const validation = await validateAnswer(query, assignment, schemaId);

    res.json({
      success: true,
      data: validation,
    });
  } catch (error) {
    console.error("Error validating answer:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to validate answer",
    });
  }
};
