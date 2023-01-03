import { MongoClient, ServerApiVersion } from 'mongodb'; 
import dotenv from 'dotenv';
dotenv.config();

const dbDriver = process.env.DBDRIVER;
const dbUser = process.env.DBUSER;
const dbPassword = process.env.DBPWD;
const dbHost = process.env.DBHOST;

const URI = `${dbDriver}://${dbUser}:${dbPassword}@${dbHost}/?retryWrites=true&w=majority`;
const client = await MongoClient.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const collection = client.db("development").collection("codeparams");

const currentDate = new Date().toLocaleString();
const testData = { 'name': 'alice', 'age': 17, 'executed_at': currentDate };
const res = await collection.insertOne(testData);
client.close();

/*
collection.insertOne(testData, (err, res) => {
  if (err) throw err;
  console.log(res);
  client.close();
});
*/
