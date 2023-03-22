const express = require('express'); //Using the express library
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
    const { name, email, session_status } = req.body;
    const result = await client.query('INSERT INTO patients(name, email, session_status) VALUES($1, $2, $3) RETURNING *', [name, email, session_status]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
