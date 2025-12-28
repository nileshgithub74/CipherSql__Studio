
export const generateHint = (query, assignment, error) => {
  const hints = [];
  const { sampleTables, question } = assignment;
  
  // If no query
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