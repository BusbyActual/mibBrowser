const mibs = require('./libsmiNew');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const CircularJSON = require('circular-json');
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/mibs', function (req, res) {
  const body = req.body
  mibs.mibLoader(body.mibs)

  let data = mibs.getData();

  data = mibs.polish(data);

  mibs.sortSubroutine(data);
  

  fs.writeFileSync('test.txt', CircularJSON.stringify(data))
  res.send(`You sent: ${body.mibs} ` + JSON.stringify(data))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})