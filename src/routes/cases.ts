import { Router } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

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

// Get all cases
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM cases');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Get a case by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;  // Get the case ID from the request parameters

  try {
    const result = await query('SELECT * FROM cases WHERE id = $1', [id]);  // Fetch the case by ID

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Case not found' });  // Return 404 if no case is found
    }

    res.json(result.rows[0]);  // Return the case data
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Create a new case with a new patient
router.post('/create', async (req, res) => {
  const { name, gender, dob, weight, height, address = '', onset } = req.body;

  // Calculate age based on dob
  const age = calculateAge(dob);

  // Generate unique IDs for patient and case
  const patient_id = uuidv4();
  const case_id = uuidv4();
  const status = "Active";
  const created_on = new Date(); // Use the current time for created_on

  try {
    // Insert a new patient into the patient table
    const patientResult = await query(
      'INSERT INTO patient (id, name, gender, age, dob, weight, height, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [patient_id, name, gender, age, dob, weight, height, address]
    );

    // Insert a new case into the cases table using the newly created patient_id, with onset, created_on, and NULL for doctor
    const caseResult = await query(
      'INSERT INTO cases (id, patient_id, status, onset, created_on, doctor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [case_id, patient_id, status, onset, created_on, null]
    );

    // Return both patient and case information in the response (without BEFAST)
    res.json({
      patient: patientResult.rows[0],
      case: caseResult.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Get all cases with status = 'Admit'
router.get('/admit/only', async (req, res) => {
  try {
    const result = await query('SELECT * FROM cases WHERE status = $1', ['Admit']);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No cases with status Admit found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching cases with status Admit:', err);
    res.status(500).send('Server Error');
  }
});

// Get all cases with status = 'Active'
router.get('/active/only', async (req, res) => {
  try {
    const result = await query('SELECT * FROM cases WHERE status = $1', ['Active']);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No cases with status Active found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching cases with status Active:', err);
    res.status(500).send('Server Error');
  }
});


// Get case by patient id without BEFAST data
router.get('/patient/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Query to get the patient data and the associated case, without BEFAST data
    const result = await query(`
      SELECT 
        patient.*, 
        cases.id AS case_id,  
        cases.status, 
        cases.onset, 
        cases.created_on, 
        cases.finished_on
      FROM 
        patient 
      JOIN cases ON patient.id = cases.patient_id
      WHERE patient.id = $1
    `, [id]);

    // If no patient is found, return a 404 response
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Return the patient data along with their associated case, without BEFAST data
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update a case's status, and onset
router.patch('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { status, onset } = req.body;

  // Array to hold dynamic query parts
  const updates = [];
  const values: any[] = [];

  // Dynamically build the query based on provided fields
  if (status !== undefined) {
    updates.push(`status = $${updates.length + 1}`);
    values.push(status);
  }

  if (onset !== undefined) {
    updates.push(`onset = $${updates.length + 1}`);
    values.push(new Date(onset));
  } else {
    // If no onset is provided, default to the current timestamp
    updates.push(`onset = $${updates.length + 1}`);
    values.push(new Date());
  }

  // If no fields to update, return an error
  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields provided for update' });
  }

  // Add the case ID as the last value
  values.push(id);

  // Create the final query
  const queryText = `UPDATE cases SET ${updates.join(', ')} WHERE id = $${updates.length + 1} RETURNING *`;

  try {
    const result = await query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update a case's status to "Admit" and set "finished_on" to current timestamp
router.patch('/finish/:id', async (req, res) => {
  const { id } = req.params;

  // Automatically set the status to "Admit" and finished_on to the current timestamp
  const queryText = `
    UPDATE cases 
    SET status = $1, finished_on = $2 
    WHERE id = $3 
    RETURNING *`;

  const values = ['Admit', new Date(), id];

  try {
    const result = await query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Delete a case by ID
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Log the ID to ensure it is being passed correctly
    console.log(`Attempting to delete case with ID: ${id}`);

    const result = await query('DELETE FROM cases WHERE id = $1 RETURNING *', [id]);

    // Log the result to verify if the case exists
    console.log('Result from deletion query:', result);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json({ message: `A case with ID ${id} has been deleted` });
  } catch (err) {
    // Log the actual error to diagnose the issue
    console.error('Error during deletion:', err);
    res.status(500).send('Server Error');
  }
});


// Get BEFAST data by case_id
router.get('/befast/:case_id', async (req, res) => {
  const { case_id } = req.params;

  try {
    // Query to get BEFAST data for the given case_id
    const result = await query(`
      SELECT 
        befast.b, 
        befast.e, 
        befast.f, 
        befast.a, 
        befast.s, 
        befast.t, 
        befast.last_modified_on
      FROM 
        befast
      WHERE 
        befast.case_id = $1
    `, [case_id]);

    // If no BEFAST data is found, return a 404 response
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'BEFAST data not found for this case_id' });
    }

    // Return the BEFAST data for the given case_id
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add BEFAST data for a specific case (when needed)
router.post('/add-befast/:case_id', async (req, res) => {
  const { case_id } = req.params;
  const { b = '0', e = '0', f = '0', a = '0', s = '0', t = '0' } = req.body;

  try {
    // Check if BEFAST data already exists for the case_id
    const existingBefast = await query('SELECT * FROM befast WHERE case_id = $1', [case_id]);

    if (existingBefast.rows.length > 0) {
      // If BEFAST data exists, return an error
      return res.status(409).json({ message: 'BEFAST data already exists for this case' });
    }

    // Insert data into befast table for the specified case
    await query(
      'INSERT INTO befast (id, case_id, b, e, f, a, s, t) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [uuidv4(), case_id, b, e, f, a, s, t]
    );

    res.json({ message: 'BEFAST data successfully added' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update befast data
router.patch('/update-befast/:case_id', async (req, res) => {
  const { case_id } = req.params;
  const { b, e, f, a, s, t } = req.body;

  // Array to hold dynamic query parts
  const updates = [];
  const values: any[] = [];

  // Dynamically build the query based on provided fields
  if (b !== undefined) {
    updates.push(`b = $${updates.length + 1}`);
    values.push(b);
  }
  if (e !== undefined) {
    updates.push(`e = $${updates.length + 1}`);
    values.push(e);
  }
  if (f !== undefined) {
    updates.push(`f = $${updates.length + 1}`);
    values.push(f);
  }
  if (a !== undefined) {
    updates.push(`a = $${updates.length + 1}`);
    values.push(a);
  }
  if (s !== undefined) {
    updates.push(`s = $${updates.length + 1}`);
    values.push(s);
  }
  if (t !== undefined) {
    updates.push(`t = $${updates.length + 1}`);
    values.push(t);
  }

  // If no fields to update, return an error
  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields provided for update' });
  }

  // Add last_modified_on to the updates
  updates.push(`last_modified_on = $${updates.length + 1}`);
  values.push(new Date()); // Add the current time for last_modified_on

  // Add the case ID as the last value
  values.push(case_id);

  // Create the final query
  const queryText = `UPDATE befast SET ${updates.join(', ')} WHERE case_id = $${updates.length + 1} RETURNING *`;

  try {
    const result = await query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Befast entry not found for the given case_id' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get CT result for a specific case by case_id
router.get('/ct_result/:case_id', async (req, res) => {
  const { case_id } = req.params;

  try {
    const result = await query('SELECT * FROM ct_result WHERE case_id = $1', [case_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'CT result not found for this case' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create a new CT result for a specific case
router.post('/ct_result/:case_id', async (req, res) => {
  const { case_id } = req.params;
  const { result } = req.body;
  const last_modified_on = new Date(); // Attach current timestamp for modified time

  try {
    const resultData = await query(
      'INSERT INTO ct_result (id, case_id, result, last_modified_on) VALUES ($1, $2, $3, $4) RETURNING *',
      [uuidv4(), case_id, result, last_modified_on]
    );
    res.json(resultData.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update the CT result for a specific case by case_id
router.patch('/ct_result/:case_id', async (req, res) => {
  const { case_id } = req.params;
  const { result } = req.body;
  const last_modified_on = new Date(); // Attach current timestamp for modified time

  try {
    const updateQuery = await query(
      'UPDATE ct_result SET result = $1, last_modified_on = $2 WHERE case_id = $3 RETURNING *',
      [result, last_modified_on, case_id]
    );

    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ message: 'CT result not found for this case' });
    }

    res.json(updateQuery.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get NIHSS score and checklist for a specific case by case_id
router.get('/nihss/:case_id', async (req, res) => {
  const { case_id } = req.params;

  try {
    const result = await query('SELECT * FROM nihss WHERE case_id = $1', [case_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'NIHSS data not found for this case' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Create a new NIHSS entry for a specific case
router.post('/nihss/:case_id', async (req, res) => {
  const { case_id } = req.params;
  const { checklist, round } = req.body;
  const last_modified_on = new Date();
  const start_on = new Date();

  // Check if the round is within the allowed range (0-4)
  if (round < 0 || round > 4) {
    return res.status(400).json({ message: 'Invalid round. Round must be between 0 and 4.' });
  }

  try {
    // Check if an entry with the same case_id and round already exists
    const existingEntry = await query(
      'SELECT * FROM nihss WHERE case_id = $1 AND round = $2',
      [case_id, round]
    );

    if (existingEntry.rows.length > 0) {
      return res.status(409).json({ message: `NIHSS entry for round ${round} already exists for this case` });
    }

    // Calculate the score from the checklist (casting both acc and value to number)
    const score = Object.values(checklist).reduce((acc: number, value: unknown) => acc + (value as number), 0);

    // Insert the new NIHSS entry if no duplicate is found
    const resultData = await query(
      'INSERT INTO nihss (id, case_id, score, round, checklist, last_modified_on, start_on) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [uuidv4(), case_id, score, round, checklist, last_modified_on, start_on]
    );

    res.json(resultData.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Update the NIHSS entry for a specific case by case_id and round
router.patch('/nihss/:case_id', async (req, res) => {
  const { case_id } = req.params;
  const { checklist, round } = req.body;
  const last_modified_on = new Date();

  try {
    // Recalculate the score from the checklist (casting both acc and value to number)
    const score = Object.values(checklist).reduce((acc: number, value: unknown) => acc + (value as number), 0);

    // Update the NIHSS score and checklist for the specific case_id and round
    const updateQuery = await query(
      'UPDATE nihss SET score = $1, checklist = $2, last_modified_on = $3 WHERE case_id = $4 AND round = $5 RETURNING *',
      [score, checklist, last_modified_on, case_id, round]
    );

    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ message: 'NIHSS entry not found for this case and round' });
    }

    res.json(updateQuery.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



// Get thrombolytic checklist data for a specific case by case_id
router.get('/thrombolytic/:case_id', async (req, res) => {
  const { case_id } = req.params;

  try {
    const result = await query('SELECT * FROM thrombolytic WHERE case_id = $1', [case_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Thrombolytic data not found for this case' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create new thrombolytic entry for a specific case
router.post('/thrombolytic/:case_id', async (req, res) => {
  const { case_id } = req.params;
  const { checklist, is_met } = req.body;
  const last_modified_on = new Date();

  try {
    // Check if a thrombolytic entry already exists for this case_id
    const existingEntry = await query('SELECT * FROM thrombolytic WHERE case_id = $1', [case_id]);

    if (existingEntry.rows.length > 0) {
      // If a thrombolytic entry exists for this case_id, return an error
      return res.status(409).json({ message: 'A thrombolytic entry already exists for this case' });
    }

    // Insert new thrombolytic entry with checklist data and is_met
    const resultData = await query(
      'INSERT INTO thrombolytic (id, case_id, checklist, is_met, last_modified_on) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [uuidv4(), case_id, checklist, is_met, last_modified_on]
    );

    res.json(resultData.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update the thrombolytic checklist for a specific case by case_id
router.patch('/thrombolytic/:case_id', async (req, res) => {
  const { case_id } = req.params;
  const { checklist } = req.body; // Only expect the checklist in the body, not is_met
  const last_modified_on = new Date();

  try {
    // Logic to determine if the criteria are met
    const isMetInclusion = Object.values(checklist.inclusion).every(value => value === true);
    const isMetAbsoluteExclusion = Object.values(checklist.absoluteExclusion).every(value => value === false);
    const isMetRelativeExclusion = Object.values(checklist.relativeExclusion).every(value => value === false);

    // If all inclusion criteria are met and both absolute and relative exclusions are false
    const is_met = isMetInclusion && isMetAbsoluteExclusion && isMetRelativeExclusion;

    // Update the thrombolytic entry with the calculated is_met and checklist
    const updateQuery = await query(
      'UPDATE thrombolytic SET checklist = $1, is_met = $2, last_modified_on = $3 WHERE case_id = $4 RETURNING *',
      [checklist, is_met, last_modified_on, case_id]
    );

    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Thrombolytic data not found for this case' });
    }

    res.json(updateQuery.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Get injection data for a specific case by case_id
router.get('/injection/:case_id', async (req, res) => {
  const { case_id } = req.params;

  try {
    const result = await query('SELECT * FROM injection WHERE case_id = $1', [case_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Injection data not found for this case' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching injection data:', err);
    res.status(500).send('Server Error');
  }
});

// Create a new injection entry for a specific case
router.post('/injection/:case_id', async (req, res) => {
  const { case_id } = req.params;
  const { bolus, drip, bolus_timestamp, drip_timestamp, doctor } = req.body;
  const last_modified_on = new Date().toISOString();

  try {
    // Check if an injection entry already exists for this case_id
    const existingEntry = await query('SELECT * FROM injection WHERE case_id = $1', [case_id]);

    if (existingEntry.rows.length > 0) {
      // If an injection entry exists for this case_id, return an error
      return res.status(409).json({ message: 'An injection entry already exists for this case' });
    }

    // Insert new injection entry
    const resultData = await query(
      'INSERT INTO injection (id, case_id, bolus, drip, bolus_timestamp, drip_timestamp, last_modified_on, doctor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [uuidv4(), case_id, bolus, drip, bolus_timestamp, drip_timestamp, last_modified_on, doctor]
    );

    res.json(resultData.rows[0]);
  } catch (err) {
    console.error('Error inserting new injection entry:', err);
    res.status(500).send('Server Error');
  }
});

// Update the injection data for a specific case by case_id
router.patch('/injection/:case_id', async (req, res) => {
  const { case_id } = req.params;
  const { bolus, drip, bolus_timestamp, drip_timestamp, doctor } = req.body;
  const last_modified_on = new Date().toISOString();

  try {
    const updateQuery = await query(
      'UPDATE injection SET bolus = COALESCE($1, bolus), drip = COALESCE($2, drip), bolus_timestamp = COALESCE($3, bolus_timestamp), drip_timestamp = COALESCE($4, drip_timestamp), doctor = COALESCE($5, doctor), last_modified_on = $6 WHERE case_id = $7 RETURNING *',
      [bolus, drip, bolus_timestamp, drip_timestamp, doctor, last_modified_on, case_id]
    );

    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Injection data not found for this case' });
    }

    res.json(updateQuery.rows[0]);
  } catch (err) {
    console.error('Error updating injection entry:', err);
    res.status(500).send('Server Error');
  }
});


export default router;
