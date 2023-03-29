const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const port = 3002;

const conString = 'postgres://oiapacch:gMPrV_4ZECs4jiw17Bd5x5x-lIJMjNGt@tiny.db.elephantsql.com/oiapacch';
const client = new pg.Client(conString);
client.connect();

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.json());

app.post('/api/patients', async (req, res) => {
  try {
    const { opthal_name, charge_per_hour, hospital, patient_name, patient_email } = req.body;
    const result = await client.query('SELECT * FROM patients WHERE patient_email=$1', [patient_email]);
    if (result.rows.length > 0 && result.rows[0].session_status === 'Scheduled') {
      res.status(400).json({ message: 'You already have a session scheduled. Cancel first to reschedule another one' });
    } else {
      const result = await client.query('INSERT INTO patients(opthal_name, charge_per_hour, hospital, patient_name, patient_email, session_status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [opthal_name, charge_per_hour, hospital, patient_name, patient_email, 'Scheduled']);
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Patient Posting Server is ready to go on port ${port}`);
});
