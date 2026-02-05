import mongoose from "mongoose";
import dotenv from "dotenv";
import Assignment from "./models/assignmentModel.js";

dotenv.config();

const sampleAssignments = [
  {
    title: "Select All Customers",
    description: "Write a SQL query to select all customers from the customers table.",
    difficulty: "Easy",
    question: "Select all columns from the customers table.",
    requirements: [
      "Use SELECT statement",
      "Include all columns",
      "Return all rows"
    ],
    hints: [
      "Use SELECT * to select all columns",
      "FROM clause specifies the table name"
    ],
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "customer_name", dataType: "VARCHAR" },
          { columnName: "email", dataType: "VARCHAR" },
          { columnName: "city", dataType: "VARCHAR" }
        ],
        rows: [
          { customer_id: 1, customer_name: "John Doe", email: "john@email.com", city: "New York" },
          { customer_id: 2, customer_name: "Jane Smith", email: "jane@email.com", city: "Los Angeles" },
          { customer_id: 3, customer_name: "Bob Johnson", email: "bob@email.com", city: "Chicago" },
          { customer_id: 4, customer_name: "Alice Brown", email: "alice@email.com", city: "Houston" },
          { customer_id: 5, customer_name: "Charlie Wilson", email: "charlie@email.com", city: "Phoenix" }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: "All customer records"
    },
    isActive: true
  },
  {
    title: "Filter Customers by City",
    description: "Write a SQL query to find all customers from a specific city.",
    difficulty: "Easy",
    question: "Select all customers who live in 'New York'.",
    requirements: [
      "Use WHERE clause",
      "Filter by city column",
      "Return matching records"
    ],
    hints: [
      "Use WHERE clause to filter rows",
      "String values should be in quotes"
    ],
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "customer_name", dataType: "VARCHAR" },
          { columnName: "email", dataType: "VARCHAR" },
          { columnName: "city", dataType: "VARCHAR" }
        ],
        rows: [
          { customer_id: 1, customer_name: "John Doe", email: "john@email.com", city: "New York" },
          { customer_id: 2, customer_name: "Jane Smith", email: "jane@email.com", city: "Los Angeles" },
          { customer_id: 3, customer_name: "Bob Johnson", email: "bob@email.com", city: "Chicago" },
          { customer_id: 4, customer_name: "Alice Brown", email: "alice@email.com", city: "Houston" },
          { customer_id: 5, customer_name: "Charlie Wilson", email: "charlie@email.com", city: "Phoenix" }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: "Customers from New York"
    },
    isActive: true
  },
  {
    title: "Count Orders by Customer",
    description: "Write a SQL query to count the number of orders for each customer.",
    difficulty: "Medium",
    question: "Count the total number of orders for each customer and display customer name with order count.",
    requirements: [
      "Use JOIN to combine tables",
      "Use GROUP BY clause",
      "Use COUNT function"
    ],
    hints: [
      "JOIN customers and orders tables",
      "GROUP BY customer to get counts per customer",
      "Use COUNT(*) to count rows"
    ],
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "customer_name", dataType: "VARCHAR" },
          { columnName: "email", dataType: "VARCHAR" }
        ],
        rows: [
          { customer_id: 1, customer_name: "John Doe", email: "john@email.com" },
          { customer_id: 2, customer_name: "Jane Smith", email: "jane@email.com" },
          { customer_id: 3, customer_name: "Bob Johnson", email: "bob@email.com" }
        ]
      },
      {
        tableName: "orders",
        columns: [
          { columnName: "order_id", dataType: "INTEGER" },
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "order_date", dataType: "DATE" },
          { columnName: "total_amount", dataType: "DECIMAL" }
        ],
        rows: [
          { order_id: 1, customer_id: 1, order_date: "2024-01-15", total_amount: 150.00 },
          { order_id: 2, customer_id: 1, order_date: "2024-01-20", total_amount: 200.00 },
          { order_id: 3, customer_id: 2, order_date: "2024-01-18", total_amount: 75.00 },
          { order_id: 4, customer_id: 3, order_date: "2024-01-22", total_amount: 300.00 },
          { order_id: 5, customer_id: 1, order_date: "2024-01-25", total_amount: 120.00 }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: "Customer names with order counts"
    },
    isActive: true
  },
  {
    title: "Top Spending Customers",
    description: "Find the top 3 customers who have spent the most money.",
    difficulty: "Medium",
    question: "Write a query to find the top 3 customers by total spending amount.",
    requirements: [
      "Use JOIN to combine tables",
      "Use SUM function",
      "Use ORDER BY and LIMIT"
    ],
    hints: [
      "JOIN customers and orders tables",
      "SUM the total_amount for each customer",
      "ORDER BY total spending DESC and LIMIT 3"
    ],
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "customer_name", dataType: "VARCHAR" }
        ],
        rows: [
          { customer_id: 1, customer_name: "John Doe" },
          { customer_id: 2, customer_name: "Jane Smith" },
          { customer_id: 3, customer_name: "Bob Johnson" }
        ]
      },
      {
        tableName: "orders",
        columns: [
          { columnName: "order_id", dataType: "INTEGER" },
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "total_amount", dataType: "DECIMAL" }
        ],
        rows: [
          { order_id: 1, customer_id: 1, total_amount: 150.00 },
          { order_id: 2, customer_id: 1, total_amount: 200.00 },
          { order_id: 3, customer_id: 2, total_amount: 75.00 },
          { order_id: 4, customer_id: 3, total_amount: 300.00 },
          { order_id: 5, customer_id: 1, total_amount: 120.00 }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: "Top 3 customers by spending"
    },
    isActive: true
  },
  {
    title: "Complex Sales Analysis",
    description: "Analyze sales data with multiple conditions and aggregations.",
    difficulty: "Hard",
    question: "Find customers who have made more than 2 orders and their average order value is greater than $100.",
    requirements: [
      "Use multiple JOINs",
      "Use HAVING clause",
      "Use multiple aggregate functions"
    ],
    hints: [
      "GROUP BY customer and use HAVING for conditions on aggregated data",
      "COUNT orders and AVG order amount",
      "HAVING COUNT(*) > 2 AND AVG(amount) > 100"
    ],
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "customer_name", dataType: "VARCHAR" }
        ],
        rows: [
          { customer_id: 1, customer_name: "John Doe" },
          { customer_id: 2, customer_name: "Jane Smith" },
          { customer_id: 3, customer_name: "Bob Johnson" }
        ]
      },
      {
        tableName: "orders",
        columns: [
          { columnName: "order_id", dataType: "INTEGER" },
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "total_amount", dataType: "DECIMAL" }
        ],
        rows: [
          { order_id: 1, customer_id: 1, total_amount: 150.00 },
          { order_id: 2, customer_id: 1, total_amount: 200.00 },
          { order_id: 3, customer_id: 1, total_amount: 120.00 },
          { order_id: 4, customer_id: 2, total_amount: 75.00 },
          { order_id: 5, customer_id: 2, total_amount: 85.00 }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: "Customers meeting criteria"
    },
    isActive: true
  }
];

const seedAssignments = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    // Clear existing assignments
    await Assignment.deleteMany({});
    console.log("Cleared existing assignments");

    // Insert sample assignments
    const result = await Assignment.insertMany(sampleAssignments);
    console.log(`Inserted ${result.length} sample assignments`);

    console.log("Sample assignments added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding assignments:", error);
    process.exit(1);
  }
};

seedAssignments();