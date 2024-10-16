import { Router } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid'; // For unique patient ID generation
import winston from 'winston';

const router = Router();

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

// Utility function to calculate age from dob
function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// Create a new patient
router.post('/create', async (req, res) => {
  const { name, gender, dob, weight, height, address = '', symptoms = '' } = req.body;  // Default to empty strings for address and symptoms

  // Calculate age based on dob
  const age = calculateAge(dob);

  // Generate a unique ID for the patient
  const id = uuidv4();

  try {
    const result = await query(
      'INSERT INTO patient (id, name, gender, age, dob, weight, height, address, symptoms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [id, name, gender, age, dob, weight, height, address, symptoms]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get all patients
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM patient');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get a single patient by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('SELECT * FROM patient WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update a patient's information partially
router.patch('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, gender, dob, weight, height, address, symptoms,reg_id } = req.body;
  
    // Array to hold dynamic query parts
    const updates = [];
    const values: any[] = [];
  
    // Dynamically build the query based on provided fields
    if (name !== undefined) {
      updates.push(`name = $${updates.length + 1}`);
      values.push(name);
    }
    if (gender !== undefined) {
      updates.push(`gender = $${updates.length + 1}`);
      values.push(gender);
    }
    if (dob !== undefined) {
      const age = calculateAge(dob); // Calculate age from dob
      updates.push(`dob = $${updates.length + 1}`);
      values.push(dob);
      updates.push(`age = $${updates.length + 1}`);
      values.push(age);
    }
    if (weight !== undefined) {
      updates.push(`weight = $${updates.length + 1}`);
      values.push(weight);
    }
    if (height !== undefined) {
      updates.push(`height = $${updates.length + 1}`);
      values.push(height);
    }
    if (address !== undefined) {
      updates.push(`address = $${updates.length + 1}`);
      values.push(address);
    }
    if (symptoms !== undefined) {
      updates.push(`symptoms = $${updates.length + 1}`);
      values.push(symptoms);
    }

    if (reg_id !== undefined) {
      updates.push(`reg_id = $${updates.length + 1}`);
      values.push(reg_id);
    }
  
    // If no fields to update, return an error
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }
  
    // Add the patient ID as the last value
    values.push(id);
  
    // Create the final query
    const queryText = `UPDATE patient SET ${updates.join(', ')} WHERE id = $${updates.length + 1} RETURNING *`;
  
    try {
      const result = await query(queryText, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

// Delete a patient by ID
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM patient WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: `Patient with ID ${id} has been deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
