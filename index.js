const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const dbClient = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: porocess.env.DB,
  password: process.env.PWD,
  port: process.env.DBPORT 
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: ['https://editor.p5js.org']
}));

dbClient.connect().then(() => console.log('DB connected'));

app.post('/data', async (req, res) => {
  const id = parseInt(req.body.userId);
  console.log(id);
  const timestamp = req.body.timestamp;
  const code = req.body.code;
  const query = {
    text: 'INSERT INTO p5log (id, timestamp, code) VALUES($1, $2, $3)',
    values: [id, timestamp, code],
  };

  dbClient.query(query, (err, res) => {
    console.log(err, res);
  });
  res.json({ "message": "success" });
});

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
