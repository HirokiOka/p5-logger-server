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
  const userId = parseInt(req.body.userId);
  const executedAt = req.body.executedAt;
  const sourceCode = req.body.code;
  const sloc = sourceCode.split('\n').length;
  console.log(`lastSourceCode: ${lastSourceCode}`);
  let ted = 0;
  if (lastSourceCode !== '') ted = calcTed(lastSourceCode, sourceCode);
  const query = {
    text: 'INSERT INTO srclog(userId, executedAt, sourceCode, sloc, ted) VALUES($1, $2, $3, $4, $5)',
    values: [userId, executedAt, sourceCode, sloc, ted],
  };
  lastSourceCode = sourceCode;
  console.log(query);
  dbClient.query(query, (err, res) => {
    if (err) console.log(err);
    //console.log(executedAt, res);
  });
  res.json({ "message": "success" });
});

app.listen(PORT, () => {
  console.log(`Server is up on http://localhost:${PORT}`);
});

