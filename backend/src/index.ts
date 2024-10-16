import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import usersRouter from './routes/users';
import patientsRouter from './routes/patient';
import casesRouter from './routes/cases';
import cors from 'cors';
import session from 'express-session';  
import pgSession from 'connect-pg-simple'; 
import { pool } from './db';
import logger from './logger'; 
import { green, yellow, blue, red, gray } from 'colorette';  

// Define a function to colorize HTTP methods
const colorizeMethod = (method: string): string => {
  switch (method) {
    case 'GET':
      return green(method); // Green for GET
    case 'POST':
      return yellow(method); // Yellow for POST
    case 'PUT':
      return blue(method); // Blue for PUT
    case 'DELETE':
      return red(method); // Red for DELETE
    default:
      return method; // Default method color
  }
};


// Initializing the express app
const app = express();

app.use(express.json());

// Enable CORS dynamically for all origins while allowing credentials
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    callback(null, true);  // Allow all origins dynamically
  },
  credentials: true,  // Allow credentials (cookies, HTTP auth, etc.)
};
app.use(cors(corsOptions));

// Session middleware configuration
app.use(session({
  store: new (pgSession(session))({
    pool: pool, // Use the existing pool from db.ts
    createTableIfMissing: true // Automatically create the session table if missing
  }),
  secret: process.env.SESSION_SECRET || 'default_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: 'lax',
  }
}));

// Middleware to check if the user is authenticated
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
}

// Custom middleware to log session initialization with Winston
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.session.isNew) {
    logger.info(`Session initialized for user. Session ID: ${req.sessionID}`);
  }
  next();
});

// Enhanced custom middleware to log requests and responses, including user information, IP, and User-Agent
app.use((req: Request, res: Response, next: NextFunction) => {
  // Get user info if logged in, otherwise default to 'No user logged in'
  const userInfo = req.session.user
    ? `Username: ${req.session.user.username}, Name: ${req.session.user.name}, Role: ${req.session.user.role}`
    : 'No user logged in';

  // Get the IP address (try x-forwarded-for for reverse proxies, fallback to req.ip)
  const ip = req.headers['x-forwarded-for'] || req.ip;

  // Get the User-Agent (browser, app, etc.)
  const userAgent = req.headers['user-agent'] || 'Unknown User-Agent';

  // Get the Referrer (which page sent the request)
  const referer = req.headers['referer'] || 'No referrer';

  // Log incoming request with additional details
  const coloredMethod = colorizeMethod(req.method);
  logger.info(`${coloredMethod} ${req.url} - Incoming request - ${userInfo} - IP: ${ip} - User-Agent: ${userAgent} - Referrer: ${referer}`);

  // Measure response time
  const startTime = Date.now();

  // Log the result when the response is finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${coloredMethod} ${req.url} - Status: ${res.statusCode} - ${duration}ms - ${userInfo} - IP: ${ip} - User-Agent: ${userAgent}`);
  });

  next();
});


// Apply `isAuthenticated` middleware to protected routes
app.use('/patient', isAuthenticated, patientsRouter);
app.use('/cases', isAuthenticated, casesRouter);

// The login and logout routes should not require authentication
app.use('/users', usersRouter);

// Running the app
const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Service started successfully. Listening on port ${PORT}`);
});
