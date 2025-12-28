import '../styles/ResultsDisplay.css';

const ResultsDisplay = ({ results, validation }) => {
  return (
    <div className="results-container">
      
      {validation && (
        <div className={`validation ${validation.isCorrect ? 'success' : 'error'}`}>
          <h4>{validation.isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h4>
          <p>{validation.message}</p>
        </div>
      )}

    
      {results?.error && (
        <div className="sql-error">
          <h4>❌ SQL Error</h4>
          <div className="error-message">
            <pre>{results.error}</pre>
          </div>
          <div className="error-help">
            <p>💡 <strong>Tips:</strong></p>
            <ul>
              <li>Check your SQL syntax (missing commas, quotes, semicolons)</li>
              <li>Verify table and column names are correct</li>
              <li>Make sure you're using the right SQL keywords</li>
              <li>Click the "Hint" button for help with this assignment</li>
            </ul>
          </div>
        </div>
      )}

  
      {results && !results.error && (
        <div className="results">
          <h4>✅ Results ({results.rowCount || 0} rows)</h4>
          
          {results.rows && results.rows.length > 0 ? (
            <div className="table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    {results.fields?.map((field, index) => (
                      <th key={index}>{field.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {results.fields?.map((field, colIndex) => (
                        <td key={colIndex}>
                          {row[field.name] !== null && row[field.name] !== undefined 
                            ? String(row[field.name]) 
                            : 'NULL'
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              <p>✅ Query executed successfully but returned no data</p>
              <small>This might be expected depending on your query (e.g., INSERT, UPDATE, DELETE)</small>
            </div>
          )}
          
          {results.executionTime && (
            <div className="execution-info">
              <small>Execution time: {results.executionTime}ms</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;