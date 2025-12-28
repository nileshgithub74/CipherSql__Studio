import '../styles/ResultsDisplay.css';

const ResultsDisplay = ({ results, validation }) => {
  return (
    <div className="results-container">
      
      {validation && (
        <div className={`validation ${validation.isCorrect ? 'success' : 'error'}`}>
          <h4>{validation.isCorrect ? ' Correct!' : ' Incorrect'}</h4>
          <p>{validation.message}</p>
        </div>
      )}

    
      {results && (
        <div className="results">
          <h4>Results ({results.rowCount} rows)</h4>
          
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
            <p>No data returned</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;