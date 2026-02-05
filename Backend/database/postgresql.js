import pkg from 'pg';
const { Pool } = pkg;
import { v4 as uuidv4 } from 'uuid';

// Create connection pool with better error handling
const createPool = () => {
  const config = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      }
    : {
        user: process.env.PG_USER || 'postgres',
        host: process.env.PG_HOST || 'localhost',
        database: process.env.PG_DATABASE || 'ciphersqlstudio_app',
        password: process.env.PG_PASSWORD || 'nilesh12',
        port: parseInt(process.env.PG_PORT) || 5432,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      };

  const pool = new Pool(config);

  // Handle pool errors
  pool.on('error', (err) => {
    console.error('PostgreSQL pool error:', err);
  });

 
  pool.connect()
    .then(client => {
      console.log(' PostgreSQL connected successfully');
      client.release();
    })
    .catch(err => {
      console.error('PostgreSQL connection failed:', err.message);
      
    });

  return pool;
};

const pool = createPool();


const convertDataType = (mongoType) => {
  const typeMap = {
    'STRING': 'TEXT',
    'VARCHAR': 'VARCHAR(255)', 
    'INTEGER': 'INTEGER',
    'DECIMAL': 'DECIMAL(10,2)',
    'DATE': 'DATE'
  };
  return typeMap[mongoType.toUpperCase()] || 'TEXT';
};


export const createWorkspace = async (sessionId = null) => {
  const schemaId = sessionId || `workspace_${uuidv4().replace(/-/g, '_')}`;
  let client;
  
  try {
    client = await pool.connect();
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${schemaId}"`);
    await client.query(`SET search_path TO "${schemaId}"`);
    
    return { schemaId, client };
  } catch (error) {
    console.error('Error creating workspace:', error.message);
    if (client) client.release();
    throw new Error(`Failed to create workspace: ${error.message}`);
  }
};


export const loadAssignmentData = async (client, schemaId, sampleTables) => {
  try {
    await client.query(`SET search_path TO "${schemaId}"`);
    
    for (const table of sampleTables) {
      const { tableName, columns, rows } = table;
      
      // Create table
      const columnDefs = columns.map(({ columnName, dataType }) => {
        const pgType = convertDataType(dataType);
        return `"${columnName}" ${pgType}`;
      }).join(', ');
      
      await client.query(`DROP TABLE IF EXISTS "${tableName}"`);
      await client.query(`CREATE TABLE "${tableName}" (${columnDefs})`);
      
      // Insert data
      if (rows && rows.length > 0) {
        for (const row of rows) {
          const columnNames = columns.map(({ columnName }) => `"${columnName}"`).join(', ');
          const values = columns.map(({ columnName }) => row[columnName]);
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
          
          await client.query(
            `INSERT INTO "${tableName}" (${columnNames}) VALUES (${placeholders})`,
            values
          );
        }
      }
    }
  } catch (error) {
    console.error('Error loading assignment data:', error.message);
    throw new Error(`Failed to load assignment data: ${error.message}`);
  }
};

export const executeUserQuery = async (client, schemaId, query) => {
  try {
    await client.query(`SET search_path TO "${schemaId}"`);
    
    const startTime = Date.now();
    const result = await client.query(query);
    const executionTime = Date.now() - startTime;
    
    return {
      rows: result.rows,
      fields: result.fields,
      rowCount: result.rowCount,
      executionTime
    };
  } catch (error) {
    console.error('Error executing query:', error.message);
    throw new Error(`Query execution failed: ${error.message}`);
  }
};


export const getSchemaInfo = async (client, schemaId) => {
  try {
    await client.query(`SET search_path TO "${schemaId}"`);
    
    const result = await client.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = $1
      ORDER BY table_name, ordinal_position
    `, [schemaId]);
    
    const schema = {};
    result.rows.forEach(row => {
      if (!schema[row.table_name]) {
        schema[row.table_name] = [];
      }
      schema[row.table_name].push({
        name: row.column_name,
        type: row.data_type
      });
    });
    
    return schema;
  } catch (error) {
    console.error('Error getting schema info:', error.message);
    throw new Error(`Failed to get schema info: ${error.message}`);
  }
};

// Get table data with sample rows and error handling
export const getTableData = async (client, schemaId) => {
  try {
    await client.query(`SET search_path TO "${schemaId}"`);
    
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = $1
    `, [schemaId]);
    
    const tables = [];
    
    for (const tableRow of tablesResult.rows) {
      const tableName = tableRow.table_name;
      
      // Get columns
      const columnsResult = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position
      `, [schemaId, tableName]);
      
      const columns = columnsResult.rows.map(col => ({
        columnName: col.column_name,
        dataType: col.data_type
      }));
      
      // Get sample data
      const dataResult = await client.query(`SELECT * FROM "${tableName}" LIMIT 10`);
      
      tables.push({
        tableName,
        columns,
        rows: dataResult.rows
      });
    }
    
    return tables;
  } catch (error) {
    console.error('Error getting table data:', error.message);
    throw new Error(`Failed to get table data: ${error.message}`);
  }
};

export { pool };