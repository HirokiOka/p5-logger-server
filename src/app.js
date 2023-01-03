import express from 'express';
import bodyParser from 'body-parser';
import { calcTed } from './parse.js';
import { MongoClient, ServerApiVersion } from 'mongodb'; 
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const mongoOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
};
const client = await MongoClient.connect(process.env.DBURI, mongoOption);
const collection = client.db("development").collection("codeparams");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let lastSourceCode = '';

app.get('/', (_, res) => res.sendFile('index.html'));
app.post('/data', async (req, _) => {
  const userName = req.body.userName;
  const executedAt = req.body.executedAt;
  const sourceCode = req.body.code;
  const sloc = sourceCode.split('\n').length;
  let ted = 0;
  if (lastSourceCode !== '') ted = calcTed(lastSourceCode, sourceCode);
  const insertData =  { userName, executedAt, sourceCode, sloc, ted };
  const response = await collection.insertOne(insertData);
  lastSourceCode = sourceCode;
});
app.listen(PORT, () => console.log(`Server is up on PORT: ${PORT}`));
