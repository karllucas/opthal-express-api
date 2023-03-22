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
all the opthalmologists from 
the ophthalmologists table */
app.get('/api/specialists', (req, res) => {
  const query = 'SELECT * FROM "public"."ophthalmologists"';
  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data from database');
    } else {
      res.json(result.rows);
    }
  });
});

app.listen(port, () => {
  console.log(`OpthalHub Express Server listening on port ${port}`);
});
