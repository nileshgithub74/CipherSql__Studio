import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Assignment from '../models/assignmentModel.js';

dotenv.config();

const sampleAssignments = [
  {
    title: "Select All Customers",
    description: "Write a SQL query to select all customers from the customers table.",
    difficulty: "Easy",
    question: "Given a table `customers` with columns `customer_id`, `first_name`, `last_name`, `email`, and `city`, write a query to select all customers.",
    requirements: [
      "Select all columns from the customers table",
      "Return all rows without any filtering"
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
          { columnName: "first_name", dataType: "VARCHAR" },
          { columnName: "last_name", dataType: "VARCHAR" },
          { columnName: "email", dataType: "VARCHAR" },
          { columnName: "city", dataType: "VARCHAR" }
        ],
        rows: [
          { customer_id: 1, first_name: "John", last_name: "Doe", email: "john@email.com", city: "New York" },
          { customer_id: 2, first_name: "Jane", last_name: "Smith", email: "jane@email.com", city: "Los Angeles" },
          { customer_id: 3, first_name: "Bob", last_name: "Johnson", email: "bob@email.com", city: "Chicago" },
          { customer_id: 4, first_name: "Alice", last_name: "Brown", email: "alice@email.com", city: "Houston" },
          { customer_id: 5, first_name: "Charlie", last_name: "Davis", email: "charlie@email.com", city: "Phoenix" }
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
    question: "Given a table `customers`, write a query to select all customers who live in 'New York'.",
    requirements: [
      "Filter customers by city = 'New York'",
      "Select all columns for matching customers"
    ],
    hints: [
      "Use WHERE clause to filter results",
      "String values should be enclosed in single quotes"
    ],
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "first_name", dataType: "VARCHAR" },
          { columnName: "last_name", dataType: "VARCHAR" },
          { columnName: "email", dataType: "VARCHAR" },
          { columnName: "city", dataType: "VARCHAR" }
        ],
        rows: [
          { customer_id: 1, first_name: "John", last_name: "Doe", email: "john@email.com", city: "New York" },
          { customer_id: 2, first_name: "Jane", last_name: "Smith", email: "jane@email.com", city: "Los Angeles" },
          { customer_id: 3, first_name: "Bob", last_name: "Johnson", email: "bob@email.com", city: "Chicago" },
          { customer_id: 6, first_name: "Sarah", last_name: "Wilson", email: "sarah@email.com", city: "New York" }
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
    question: "Given tables `customers` and `orders`, write a query to count how many orders each customer has placed.",
    requirements: [
      "Join customers and orders tables",
      "Group by customer",
      "Count orders per customer"
    ],
    hints: [
      "Use JOIN to combine tables",
      "GROUP BY customer information",
      "Use COUNT() function"
    ],
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "first_name", dataType: "VARCHAR" },
          { columnName: "last_name", dataType: "VARCHAR" }
        ],
        rows: [
          { customer_id: 1, first_name: "John", last_name: "Doe" },
          { customer_id: 2, first_name: "Jane", last_name: "Smith" },
          { customer_id: 3, first_name: "Bob", last_name: "Johnson" }
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
          { order_id: 4, customer_id: 3, order_date: "2024-01-22", total_amount: 300.00 }
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
    title: "Top Selling Products",
    description: "Find the top 3 best-selling products by total quantity sold.",
    difficulty: "Medium",
    question: "Given tables `products` and `order_items`, write a query to find the top 3 products by total quantity sold.",
    requirements: [
      "Join products and order_items tables",
      "Sum quantities for each product",
      "Order by total quantity descending",
      "Limit to top 3 results"
    ],
    hints: [
      "Use SUM() to calculate total quantities",
      "GROUP BY product",
      "ORDER BY total quantity DESC",
      "Use LIMIT 3"
    ],
    sampleTables: [
      {
        tableName: "products",
        columns: [
          { columnName: "product_id", dataType: "INTEGER" },
          { columnName: "product_name", dataType: "VARCHAR" },
          { columnName: "price", dataType: "DECIMAL" }
        ],
        rows: [
          { product_id: 1, product_name: "Laptop", price: 999.99 },
          { product_id: 2, product_name: "Mouse", price: 25.99 },
          { product_id: 3, product_name: "Keyboard", price: 79.99 },
          { product_id: 4, product_name: "Monitor", price: 299.99 }
        ]
      },
      {
        tableName: "order_items",
        columns: [
          { columnName: "order_item_id", dataType: "INTEGER" },
          { columnName: "product_id", dataType: "INTEGER" },
          { columnName: "quantity", dataType: "INTEGER" }
        ],
        rows: [
          { order_item_id: 1, product_id: 2, quantity: 50 },
          { order_item_id: 2, product_id: 1, quantity: 10 },
          { order_item_id: 3, product_id: 3, quantity: 30 },
          { order_item_id: 4, product_id: 2, quantity: 25 },
          { order_item_id: 5, product_id: 4, quantity: 15 }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: "Top 3 products with total quantities"
    },
    isActive: true
  },
  {
    title: "Employee Salary Analysis",
    description: "Find employees earning more than the average salary in their department.",
    difficulty: "Hard",
    question: "Given an `employees` table, write a query to find all employees who earn more than the average salary in their department.",
    requirements: [
      "Calculate average salary per department",
      "Compare each employee's salary to their department average",
      "Return employees earning above department average"
    ],
    hints: [
      "Use subquery or window functions",
      "Calculate AVG() salary by department",
      "Compare individual salary to department average"
    ],
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "employee_id", dataType: "INTEGER" },
          { columnName: "first_name", dataType: "VARCHAR" },
          { columnName: "last_name", dataType: "VARCHAR" },
          { columnName: "department", dataType: "VARCHAR" },
          { columnName: "salary", dataType: "DECIMAL" }
        ],
        rows: [
          { employee_id: 1, first_name: "John", last_name: "Doe", department: "Engineering", salary: 75000 },
          { employee_id: 2, first_name: "Jane", last_name: "Smith", department: "Engineering", salary: 85000 },
          { employee_id: 3, first_name: "Bob", last_name: "Johnson", department: "Sales", salary: 60000 },
          { employee_id: 4, first_name: "Alice", last_name: "Brown", department: "Sales", salary: 55000 },
          { employee_id: 5, first_name: "Charlie", last_name: "Davis", department: "Engineering", salary: 90000 }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: "Employees earning above department average"
    },
    isActive: true
  }
];

const seedAssignments = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Clear existing assignments
    await Assignment.deleteMany({});
    console.log('Cleared existing assignments');

    // Insert sample assignments
    const result = await Assignment.insertMany(sampleAssignments);
    console.log(`Inserted ${result.length} sample assignments`);

    // Display inserted assignments
    result.forEach((assignment, index) => {
      console.log(`${index + 1}. ${assignment.title} (${assignment.difficulty})`);
    });

    console.log('\nSample assignments added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding assignments:', error);
    process.exit(1);
  }
};

seedAssignments();