const express = require('express');
const app = express();
const pg = require('pg');
const cors = require('cors');
const port = 3003;

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
  console.log(`Check Schedule Server is listening on port ${port}`);
});
