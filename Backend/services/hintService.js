
import { GoogleGenerativeAI } from '@google/generative-ai';

class HintService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async generateHint(assignmentQuestion, userQuery, schema, difficulty = 'Easy') {
    try {
      // Validate API key exists
      if (!process.env.GEMINI_API_KEY) {
        console.error('Gemini API key not found');
        return this.getFallbackHint(assignmentQuestion, difficulty);
      }

      const prompt = this.buildPrompt(assignmentQuestion, userQuery, schema, difficulty);
      
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const hint = response.text();
      
      return {
        success: true,
        hint: hint.trim(),
        type: 'ai_generated'
      };
    } catch (error) {
      console.error('Gemini AI Error:', error.message);
      
      // Check if it's an API key issue
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('API key not valid')) {
        console.error('Invalid Gemini API key - using fallback hints');
      }
      
      // Fallback to basic hints if AI fails
      return this.getFallbackHint(assignmentQuestion, difficulty);
    }
  }

  buildPrompt(question, userQuery, schema, difficulty) {
    return `You are a helpful SQL tutor. A student is working on a SQL problem and needs a hint.

ASSIGNMENT DETAILS:
- Question: ${question}
- Difficulty: ${difficulty}
- Database Schema: ${JSON.stringify(schema, null, 2)}

STUDENT'S CURRENT QUERY:
${userQuery || 'No query written yet'}

INSTRUCTIONS:
1. Provide a helpful hint that guides the student toward the solution WITHOUT giving the complete answer
2. Be encouraging and educational
3. Focus on the specific SQL concept they need to understand
4. If they haven't written a query yet, suggest where to start
5. If their query has issues, point them in the right direction
6. Keep the hint concise (2-3 sentences maximum)
7. Use simple, clear language appropriate for learning SQL

Provide only the hint text, no additional formatting or explanations:`;
  }

  getFallbackHint(question, difficulty) {
    const fallbackHints = {
      'Easy': [
        "Start with a basic SELECT statement to retrieve data from the table.",
        "Remember to use WHERE clause to filter specific conditions.",
        "Check the column names in the schema and make sure you're selecting the right ones.",
        "Try using ORDER BY to sort your results if needed."
      ],
      'Medium': [
        "Consider using JOIN operations to combine data from multiple tables.",
        "You might need to use GROUP BY with aggregate functions like COUNT, SUM, or AVG.",
        "Think about using subqueries or HAVING clause for complex filtering.",
        "Check if you need to use DISTINCT to remove duplicate results."
      ],
      'Hard': [
        "This problem likely requires advanced concepts like window functions or complex JOINs.",
        "Consider using CTEs (Common Table Expressions) to break down the problem.",
        "You might need multiple subqueries or correlated subqueries.",
        "Think about using CASE statements for conditional logic."
      ]
    };

    const hints = fallbackHints[difficulty] || fallbackHints['Easy'];
    const randomHint = hints[Math.floor(Math.random() * hints.length)];

    return {
      success: true,
      hint: randomHint,
      type: 'fallback'
    };
  }

  async getProgressiveHint(assignmentId, hintLevel = 1) {
    try {
      const progressiveHints = {
        1: "Think about what data you need to retrieve and from which table(s).",
        2: "Consider what conditions you need to filter the data.",
        3: "Look at the expected output format - do you need to group or sort the data?"
      };

      return {
        success: true,
        hint: progressiveHints[hintLevel] || progressiveHints[1],
        type: 'progressive',
        level: hintLevel
      };
    } catch (error) {
      console.error('Progressive hint error:', error);
      return {
        success: false,
        message: 'Unable to generate hint at this time'
      };
    }
  }
}

// Legacy function for backward compatibility
export const generateHint = (query, assignment, error) => {
  const hints = [];
  const { sampleTables, question } = assignment;
  
  if (!query || query.trim() === '') {
    hints.push("Start with SELECT to get data from tables.");
    hints.push(`Available tables: ${sampleTables.map(({ tableName }) => tableName).join(', ')}`);
    return hints.join(' ');
  }
  
  const upperQuery = query.toUpperCase();
  
  if (!upperQuery.includes('SELECT')) {
    hints.push("Start your query with SELECT.");
  }
  
  if (error) {
    if (error.includes('does not exist')) {
      hints.push("Check table and column names for typos.");
    }
    if (error.includes('syntax error')) {
      hints.push("Check your SQL syntax - commas, quotes, parentheses.");
    }
  }
  
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('where') && !upperQuery.includes('WHERE')) {
    hints.push("Try using WHERE to filter data.");
  }
  
  if (lowerQuestion.includes('group') && !upperQuery.includes('GROUP BY')) {
    hints.push("Consider using GROUP BY to group results.");
  }
  
  if (lowerQuestion.includes('join') && !upperQuery.includes('JOIN')) {
    hints.push("You might need to JOIN tables together.");
  }
  
  return hints.length > 0 ? hints.join(' ') : "Break the problem into smaller steps.";
};

export default new HintService();