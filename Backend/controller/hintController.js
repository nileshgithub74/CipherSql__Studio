import hintService from '../services/hintService.js';
import Assignment from '../models/assignmentModel.js';

// Get AI-generated hint for an assignment
export const getHint = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { userQuery } = req.body;

    
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    const hintResult = await hintService.generateHint(
      assignment.question,
      userQuery,
      assignment.sampleTables,
      assignment.difficulty
    );

    if (hintResult.success) {
      res.json({
        success: true,
        hint: hintResult.hint,
        type: hintResult.type,
        assignment: {
          id: assignment._id,
          title: assignment.title,
          difficulty: assignment.difficulty
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Unable to generate hint at this time'
      });
    }

  } catch (error) {
    console.error('Hint controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get progressive hint (multiple levels)
export const getProgressiveHint = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { hintLevel = 1 } = req.body;

    const hintResult = await hintService.getProgressiveHint(assignmentId, hintLevel);

    if (hintResult.success) {
      res.json({
        success: true,
        hint: hintResult.hint,
        level: hintResult.level,
        type: hintResult.type
      });
    } else {
      res.status(500).json({
        success: false,
        message: hintResult.message
      });
    }

  } catch (error) {
    console.error('Progressive hint controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};