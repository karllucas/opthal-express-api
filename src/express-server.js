const express = require('express');
const app = express();
const pg = require('pg');
const cors = require('cors');
const port = 3001;

app.use(cors()); // Enable CORS
require('dotenv').config(); // Load environment variables from .env file

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store');
  next();
});

/* Sets the Connection String to Postgres
and creates a new client that connects
to the database */
const conString = 'postgres://oiapacch:gMPrV_4ZECs4jiw17Bd5x5x-lIJMjNGt@tiny.db.elephantsql.com/oiapacch'; //Postgres Connection String
const client = new pg.Client(conString);
client.connect();

/* API endpoint that retrieves 
all the ophthalmologists from 
the ophthalmologists table */
app.get('/api/specialists', (req, res) => {
  const query = 'SELECT * FROM "public"."ophthalmologists" LIMIT 7';
  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data from database');
    } else {
      res.json(result.rows);
    }
  });
});

/* API endpoint that retrieves the next n items 
from the ophthalmologists table */
app.get('/api/specialists/:offset/:limit', (req, res) => {
  const offset = req.params.offset;
  const limit = req.params.limit;
  const query = `SELECT * FROM "public"."ophthalmologists" OFFSET ${offset} LIMIT ${limit}`;
  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data from database');
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/api/patients', async (req, res) => {
  const { patient_email } = req.query;
  try {
    const result = await client.query('SELECT session_status FROM patients WHERE patient_email=$1', [patient_email]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`OpthalHub Express Server listening on port ${port}`);
});
