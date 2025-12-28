import { executeUserQuery, pool } from '../database/postgresql.js';

const compareResults = (userResult, expectedResult) => {

  if (userResult.rows.length !== expectedResult.rows.length) {
    return {
      isCorrect: false,
      message: `Your query result doesn't match the expected answer.`
    };
  }

  if (userResult.fields.length !== expectedResult.fields.length) {
    return {
      isCorrect: false,
      message: `Your query result doesn't match the expected answer.`
    };
  }

  const userColumns = userResult.fields.map(f => f.name.toLowerCase()).sort();
  const expectedColumns = expectedResult.fields.map(f => f.name.toLowerCase()).sort();
  
  for (let i = 0; i < userColumns.length; i++) {
    if (userColumns[i] !== expectedColumns[i]) {
      return {
        isCorrect: false,
        message: `Your query result doesn't match the expected answer.`
      };
    }
  }

  const sortResults = (rows) => {
    return [...rows].sort((a, b) => {
      const firstCol = Object.keys(a)[0];
      if (a[firstCol] < b[firstCol]) return -1;
      if (a[firstCol] > b[firstCol]) return 1;
      return 0;
    });
  };

  const sortedUserRows = sortResults(userResult.rows);
  const sortedExpectedRows = sortResults(expectedResult.rows);

  for (let i = 0; i < sortedUserRows.length; i++) {
    const userRow = sortedUserRows[i];
    const expectedRow = sortedExpectedRows[i];

    for (const column of expectedColumns) {
      const userValue = String(userRow[column] || '').trim();
      const expectedValue = String(expectedRow[column] || '').trim();
      
      if (userValue !== expectedValue) {
        return {
          isCorrect: false,
          message: `Your query result doesn't match the expected answer.`
        };
      }
    }
  }

  return {
    isCorrect: true,
    message: 'Perfect! Your query returned the correct result.'
  };
};



const getExpectedQuery = (assignment) => {
  const expectedQueries = {
    "Basic SELECT Query": "SELECT * FROM employees",
    "WHERE Clause Filtering": "SELECT * FROM employees WHERE department = 'Engineering' AND salary > 50000",
    "JOIN Operations": "SELECT e.name, p.project_name FROM employees e INNER JOIN projects p ON e.project_id = p.id",
    "Aggregate Functions": "SELECT department, AVG(salary) as avg_salary, COUNT(*) as employee_count FROM employees GROUP BY department",
    "Find High Salary Employees": "SELECT * FROM employees WHERE salary > 50000",
    "Department-wise Employee Count": "SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department",
    "Total Order Value per Customer": "SELECT customer_id, SUM(order_value) as total_value FROM orders GROUP BY customer_id",
    "Highest Paid Employee": "SELECT * FROM employees ORDER BY salary DESC LIMIT 1"
  };
  
  return expectedQueries[assignment.title] || null;
};

export const validateAnswer = async (userQuery, assignment, schemaId) => {
  const expectedQuery = getExpectedQuery(assignment);
  
  if (!expectedQuery) {
    
    return {
      isCorrect: true,
      message: 'Query executed successfully!',
      canValidate: true
    };
  }

  const client = await pool.connect();
  
  const userResult = await executeUserQuery(client, schemaId, userQuery);
  const expectedResult = await executeUserQuery(client, schemaId, expectedQuery);
  
  client.release();
  
  const validation = compareResults(userResult, expectedResult);
  
  return {
    ...validation,
    canValidate: true,
    expectedQuery: expectedQuery
  };
};