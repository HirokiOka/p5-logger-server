const express = require('express');
const ejs = require('ejs');
const { Client } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const dbClient = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PWD,
  port: process.env.DBPORT,
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dbClient.connect()
  .then(() => console.log('DB connected'))
  .catch((e) => console.error(e));

app.get('', (req, res) => {
  res.render('index');
});

app.post('/data', async (req, res) => {
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
