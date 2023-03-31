const express = require('express');
const app = express();
const pg = require('pg');
const cors = require('cors');
const port = 3004; 

app.use(cors()); // Enable CORS
require('dotenv').config(); // Load environment variables from .env file

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store');
  next();
});

/* Sets Connection String to Postgres
and deletes a client */
const conString = 'postgres://oiapacch:gMPrV_4ZECs4jiw17Bd5x5x-lIJMjNGt@tiny.db.elephantsql.com/oiapacch'; //Postgres Connection String
const client = new pg.Client(conString);
client.connect();

/* API endpoint that sends 
a delete request to the pateints table */
app.delete('/api/patients/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const result = await client.query('DELETE FROM patients WHERE patient_email=$1 RETURNING *', [email]);
      if (result.rows.length === 0) {
        res.status(404).json({ message: `No patient found with email ${email}` });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Delete Patient Server is ready to go on port ${port}`);
  });
