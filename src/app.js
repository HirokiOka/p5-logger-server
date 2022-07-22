import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';

import { calcTed } from './parse.js';
import { setConfig } from './config.js';


const app = express();
const PORT = process.env.PORT || 3000;
const dbClient = new pg.Client(setConfig.development);
let lastSourceCode = '';

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
  console.log(lastSourceCode);
  if (lastSourceCode !== '') {
    const ted = calcTed(lastSourceCode, code);
    console.log(`ted: ${ted}`);
  }
  const query = {
    text: 'INSERT INTO p5log (id, timestamp, code) VALUES($1, $2, $3)',
    values: [id, timestamp, code],
  };
  lastSourceCode = code;

  dbClient.query(query, (err, res) => {
    if (err) console.log(err);
    console.log(timestamp, res);
  });
  res.json({ "message": "success" });
});

app.listen(PORT, () => {
  console.log(`Server is up on http://localhost:${PORT}`);
});
