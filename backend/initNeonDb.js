const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_MuCTYxQVb65w@ep-aged-base-apgwvnxt.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString });

const createTables = async () => {
  try {
    await client.connect();
    console.log('Connected to Neon Database.');

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'employee'
      );
    `;

    const createExpensesTable = `
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        datetime TIMESTAMP NOT NULL,
        reference_number VARCHAR(100),
        notes TEXT,
        bill_url VARCHAR(255),
        status VARCHAR(20) DEFAULT 'Pending'
      );
    `;

    await client.query(createUsersTable);
    console.log('Users table initialized.');
    
    await client.query(createExpensesTable);
    console.log('Expenses table initialized.');

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
};

createTables();
