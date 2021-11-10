const express = require('express');
//const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: ['https://editor.p5js.org']
}));

app.post('/data', async (req, res) => {
  console.log(req.body);
  const postedData = JSON.stringify(req.body);
  fs.appendFile('./p5log.json', postedData, (err) => {
    if (err) throw err;
    console.log('data appended');
  });
  res.json({ "message": "success" });
});

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
