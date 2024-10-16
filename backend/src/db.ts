import { Pool } from 'pg';
import dotenv from 'dotenv';
import winston from 'winston';
import { yellow } from 'colorette';  // Import yellow for coloring log messages
dotenv.config();

// Create a Winston logger instance (reuse it from your index.ts if needed)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      // Color the message with yellow for orange-like color
      return `${yellow(`${timestamp} [${level.toUpperCase()}]:`)} ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

// Initialize the Postgres connection pool
export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
});

// Test the database connection when the app starts
const testDbConnection = async () => {
  try {
    await pool.query('SELECT NOW()');  // Simple test query
    logger.info('Connected to the database successfully');
  } catch (err) {
    logger.error('Failed to connect to the database:', err);
    process.exit(1);  // Exit the application if the database connection fails
  }
};

// Run the test when this file is imported
testDbConnection();

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
