import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  question: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  hints: [{
    type: String
  }],
  sampleTables: [{
    tableName: {
      type: String,
      required: true
    },
    columns: [{
      columnName: {
        type: String,
        required: true
      },
      dataType: {
        type: String,
        required: true
      }
    }],
    rows: [{
      type: mongoose.Schema.Types.Mixed,
    }]
  }],
  expectedOutput: {
    type: {
      type: String,
      enum: ['table', 'single_value', 'column', 'row', 'count'],
      default: 'table'
    },
    value: mongoose.Schema.Types.Mixed
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create UserProgress schema for tracking
const userProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  sqlQuery: String,
  lastAttempt: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  attemptCount: {
    type: Number,
    default: 0
  },
  lastError: String,
  hintUsedCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
const UserProgress = mongoose.model("UserProgress", userProgressSchema);

export { Assignment as default, UserProgress };