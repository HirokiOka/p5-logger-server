import express from 'express';
import bodyParser from 'body-parser';
import { calcTed } from './parse.js';
import { MongoClient, ServerApiVersion } from 'mongodb'; 
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const dbDriver = process.env.DBDRIVER;
const dbUser = process.env.DBUSER;
const dbPassword = process.env.DBPWD;
const dbHost = process.env.DBHOST;

const URI = `${dbDriver}://${dbUser}:${dbPassword}@${dbHost}/?retryWrites=true&w=majority`;
const client = await MongoClient.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const collection = client.db("development").collection("codeparams");


let lastSourceCode = '';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (_, res) => {
  res.sendFile('index.html');
});

app.post('/data', async (req, res) => {
  const userId = parseInt(req.body.userId);
  const executedAt = req.body.executedAt;
  const sourceCode = req.body.code;
  const sloc = sourceCode.split('\n').length;
  let ted = 0;
  if (lastSourceCode !== '') ted = calcTed(lastSourceCode, sourceCode);
  const insertData =  { userId, executedAt, sourceCode, sloc, ted };
  const res = await collection.insertOne(insertData);
  lastSourceCode = sourceCode;
});

app.listen(PORT, () => {
  console.log(`Server is up on http://localhost:${PORT}`);
});

