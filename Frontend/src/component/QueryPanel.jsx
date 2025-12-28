import SQLEditor from './SQLEditor';
import ResultsDisplay from './ResultsDisplay';
import '../styles/QueryPanel.css';

const QueryPanel = ({ onExecute, results, validation, showResults, onToggleResults, resultsRef, editorRef, assignment }) => {
  const hasResults = results && (results.rows?.length > 0 || validation || results.error);

  return (
    <div className="query-panel">
      <div className={hasResults && showResults ? "editor" : "editor full"} ref={editorRef}>
        <SQLEditor 
          onExecute={onExecute}
          assignment={assignment}
        />
      </div>

      {hasResults && (
        <div className="results" ref={resultsRef} style={{ display: showResults ? 'flex' : 'none' }}>
          <div className="results-header">
            <h3>{results?.error ? 'Query Error' : 'Query Results'}</h3>
            <button onClick={onToggleResults}>Hide</button>
          </div>
          <div className="results-content">
            <ResultsDisplay results={results} validation={validation} />
          </div>
        </div>
      )}

      {hasResults && !showResults && (
        <div className="results-collapsed">
          <button onClick={onToggleResults} className="show-results-btn">
            Show Results ({results?.error ? 'Error' : `${results?.rowCount || 0} rows`})
          </button>
        </div>
      )}
    </div>
  );
};

export default QueryPanel;