import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import Editor from '@monaco-editor/react';
import axios from 'axios';
import API_CONFIG from '../config/api';
import { useTheme } from '../context/ThemeContext';
import '../styles/SQLEditor.css';

const SQLEditor = forwardRef(({ onExecute, assignment }, ref) => {
  const [query, setQuery] = useState("");
  const { isDark } = useTheme();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Expose getValue method and other functions to parent component
  useImperativeHandle(ref, () => ({
    getValue: () => query,
    clearQuery: () => setQuery('')
  }));

  useEffect(() => {
    // Setup autocomplete when editor is ready
    if (editorRef.current && monacoRef.current && assignment) {
      setupSQLAutocompletion();
    }
  }, [assignment]);

  const setupSQLAutocompletion = () => {
    const monaco = monacoRef.current;
    const editor = editorRef.current;

    // Extract table and column information from assignment
    const tables = assignment.sampleTables || [];
    const suggestions = generateSQLSuggestions(tables);

    // Register completion provider
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        return {
          suggestions: suggestions.map(suggestion => ({
            ...suggestion,
            range: range
          }))
        };
      }
    });

    // Register hover provider for table/column info
    monaco.languages.registerHoverProvider('sql', {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;

        const hoverInfo = getHoverInfo(word.word, tables);
        if (hoverInfo) {
          return {
            range: new monaco.Range(
              position.lineNumber,
              word.startColumn,
              position.lineNumber,
              word.endColumn
            ),
            contents: [{ value: hoverInfo }]
          };
        }
        return null;
      }
    });
  };

  const generateSQLSuggestions = (tables) => {
    const suggestions = [];

    // SQL Keywords
    const sqlKeywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
      'GROUP BY', 'ORDER BY', 'HAVING', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN',
      'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'INDEX', 'TABLE',
      'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL',
      'LIMIT', 'OFFSET', 'UNION', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'AS'
    ];

    sqlKeywords.forEach(keyword => {
      suggestions.push({
        label: keyword,
        kind: 14, // Keyword
        insertText: keyword,
        detail: 'SQL Keyword',
        documentation: `SQL keyword: ${keyword}`
      });
    });

    // SQL Functions
    const sqlFunctions = [
      { name: 'COUNT(*)', detail: 'Count all rows' },
      { name: 'COUNT(column)', detail: 'Count non-null values' },
      { name: 'SUM(column)', detail: 'Sum of values' },
      { name: 'AVG(column)', detail: 'Average of values' },
      { name: 'MAX(column)', detail: 'Maximum value' },
      { name: 'MIN(column)', detail: 'Minimum value' },
      { name: 'UPPER(column)', detail: 'Convert to uppercase' },
      { name: 'LOWER(column)', detail: 'Convert to lowercase' },
      { name: 'LENGTH(column)', detail: 'String length' },
      { name: 'SUBSTRING(column, start, length)', detail: 'Extract substring' },
      { name: 'CONCAT(str1, str2)', detail: 'Concatenate strings' },
      { name: 'NOW()', detail: 'Current timestamp' },
      { name: 'DATE(column)', detail: 'Extract date part' }
    ];

    sqlFunctions.forEach(func => {
      suggestions.push({
        label: func.name,
        kind: 3, // Function
        insertText: func.name,
        detail: func.detail,
        documentation: func.detail
      });
    });

    // Table names
    tables.forEach(table => {
      suggestions.push({
        label: table.tableName,
        kind: 19, // Struct (for tables)
        insertText: table.tableName,
        detail: `Table: ${table.tableName}`,
        documentation: `Table with ${table.columns?.length || 0} columns`
      });

      // Column names for each table
      if (table.columns) {
        table.columns.forEach(column => {
          suggestions.push({
            label: `${table.tableName}.${column.columnName}`,
            kind: 5, // Field
            insertText: `${table.tableName}.${column.columnName}`,
            detail: `${column.dataType}`,
            documentation: `Column: ${column.columnName} (${column.dataType}) from table ${table.tableName}`
          });

          // Also add just column name
          suggestions.push({
            label: column.columnName,
            kind: 5, // Field
            insertText: column.columnName,
            detail: `${column.dataType} - ${table.tableName}`,
            documentation: `Column: ${column.columnName} (${column.dataType}) from table ${table.tableName}`
          });
        });
      }
    });

    return suggestions;
  };

  const getHoverInfo = (word, tables) => {
    // Check if word is a table name
    const table = tables.find(t => t.tableName.toLowerCase() === word.toLowerCase());
    if (table) {
      const columnList = table.columns?.map(col => `• ${col.columnName} (${col.dataType})`).join('\n') || '';
      return `**Table: ${table.tableName}**\n\nColumns:\n${columnList}`;
    }

    // Check if word is a column name
    for (const table of tables) {
      const column = table.columns?.find(col => col.columnName.toLowerCase() === word.toLowerCase());
      if (column) {
        return `**Column: ${column.columnName}**\n\nType: ${column.dataType}\nTable: ${table.tableName}`;
      }
    }

    return null;
  };

  const handleExecute = () => {
    if (query.trim()) {
      onExecute(query);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure SQL language features
    monaco.languages.setLanguageConfiguration('sql', {
      comments: {
        lineComment: '--',
        blockComment: ['/*', '*/']
      },
      brackets: [
        ['(', ')'],
        ['[', ']']
      ],
      autoClosingPairs: [
        { open: '(', close: ')' },
        { open: '[', close: ']' },
        { open: "'", close: "'" },
        { open: '"', close: '"' }
      ],
      surroundingPairs: [
        { open: '(', close: ')' },
        { open: '[', close: ']' },
        { open: "'", close: "'" },
        { open: '"', close: '"' }
      ]
    });

    // Setup autocompletion if assignment is available
    if (assignment) {
      setupSQLAutocompletion();
    }

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleExecute();
    });
  };

  return (
    <div className="sql-editor">
      <div className="editor-content">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={query}
          onChange={(value) => setQuery(value || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            lineNumbers: 'on',
            automaticLayout: true,
            wordWrap: 'on',
            suggestOnTriggerCharacters: true,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false
            },
            parameterHints: {
              enabled: true
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showFunctions: true,
              showFields: true,
              showVariables: true,
              showClasses: true,
              showStructs: true,
              showInterfaces: true,
              showModules: true,
              showProperties: true,
              showEvents: true,
              showOperators: true,
              showUnits: true,
              showValues: true,
              showConstants: true,
              showEnums: true,
              showEnumMembers: true,
              showReferences: true,
              showFolders: true,
              showTypeParameters: true,
              showIssues: true,
              showUsers: true,
              showColors: true
            }
          }}
          theme={isDark ? "vs-dark" : "light"}
        />
      </div>
    </div>
  );
});

SQLEditor.displayName = 'SQLEditor';

export default SQLEditor;