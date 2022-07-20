const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const dbClient = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dbClient.connect()
  .then(() => console.log('DB connected'))
  .catch((e) => console.error(e));

app.get('/', (_, res) => {
  res.sendFile('index.html');
});

app.post('/data', (req, res) => {
  const id = parseInt(req.body.userId);
  const timestamp = req.body.timestamp;
  const code = req.body.code;
  const query = {
    text: 'INSERT INTO p5log (id, timestamp, code) VALUES($1, $2, $3)',
    values: [id, timestamp, code],
  };

  dbClient.query(query, (err, res) => {
    if (err) console.log(err);
    console.log(res);
  });
  res.json({ "message": "success" });
});

app.listen(PORT, () => {
  console.log(`Server is up on http://localhost:${PORT}`);
});
