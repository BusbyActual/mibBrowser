const mibs = require('./libsmiNew');
const express = require('express');
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/mibs', function (req, res) {
//example
  mibs.mibLoader(['RS-XX9-AIR-COOLING-MIB', 'RS-XX9-ATSC-MIB'])
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})