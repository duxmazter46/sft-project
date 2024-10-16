import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../db';
import bcrypt from 'bcrypt';
import logger from '../logger';

const router = Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
}

// Middleware to check if the user has the 'admin' role
function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access only' });
  }
  next();
}

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get the logged-in user's info
router.get('/me', isAuthenticated, (req: Request, res: Response) => {
  if (req.session.user) {
    // Send the user session data as a response
    res.json({ user: req.session.user });
  } else {
    res.status(404).json({ message: 'No user session found' });
  }
});

// Get user details by username (Admin only)
router.get('/:username', isAuthenticated, isAdmin, async (req, res) => {
  const { username } = req.params;

  try {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/create', async (req, res) => {
  const { name, email, username, password } = req.body;

  try {
    // First, check if the email or username already exists
    const checkDuplicate = await query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({
        message: 'Username or Email already exists. Please choose a different one.',
      });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user if no duplicates were found
    const result = await query(
      'INSERT INTO users (name, email, username, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, username, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Login endpoint
router.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  try {
    const result = await query('SELECT * FROM users WHERE username = $1 OR email = $1', [usernameOrEmail]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Store user info and role in session
    req.session.user = { id: user.id, username: user.username, role: user.role, name: user.name, email: user.email };

    // Log the user who just logged in
    logger.info(`User logged in: Username: ${user.username}, Name: ${user.name}, Role: ${user.role}`);

    // Send success response
    res.json({ message: 'Logged in successfully', user: req.session.user });
  } catch (err) {
    logger.error('Error during login:', err); // Log error using logger
    res.status(500).send('Server Error');
  }
});


// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Reset password (Admin) endpoint
router.post('/reset-password', isAuthenticated, isAdmin, async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await query('UPDATE users SET password = $1 WHERE username = $2', [hashedPassword, username]);

    res.json({ message: `Password for ${username} has been reset` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Set status endpoint (requires admin role)
router.patch('/setStatus', isAuthenticated, isAdmin, async (req, res) => {
  const { username } = req.body;

  try {
    // Fetch the current status of the user by username
    const result = await query('SELECT status FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentStatus = result.rows[0].status;
    const newStatus = !currentStatus;

    // Update the user's status in the database
    await query('UPDATE users SET status = $1 WHERE username = $2', [newStatus, username]);

    res.json({ message: `User ${username}'s status has been updated to ${newStatus}` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update user information (requires admin role)
router.patch('/update/:username', isAuthenticated, isAdmin, async (req, res) => {
  const { username } = req.params;
  const { role, name, email, department_id } = req.body;

  try {
    // Check if the user exists
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build the query dynamically to update only the provided fields
    const updates = [];
    const values = [];

    if (role) {
      updates.push('role = $' + (updates.length + 1));
      values.push(role);
    }
    if (name) {
      updates.push('name = $' + (updates.length + 1));
      values.push(name);
    }
    if (email) {
      updates.push('email = $' + (updates.length + 1));
      values.push(email);
    }
    if (department_id) {
      updates.push('department_id = $' + (updates.length + 1));
      values.push(department_id);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }

    // Add the username to the values array for the WHERE clause
    values.push(username);

    // Build the final query
    const queryText = `UPDATE users SET ${updates.join(', ')} WHERE username = $${updates.length + 1}`;

    // Execute the query
    await query(queryText, values);

    res.json({ message: `User ${username} has been updated` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Delete user endpoint (requires admin role)
router.delete('/delete', isAuthenticated, isAdmin, async (req, res) => {
  const { username } = req.body;

  try {
    // Check if the user exists
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user from the database
    await query('DELETE FROM users WHERE username = $1', [username]);

    res.json({ message: `User ${username} has been deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



export default router;
