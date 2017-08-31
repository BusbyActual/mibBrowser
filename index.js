const mibs = require('./libsmiNew');
const bodyParser = require('body-parser');
const express = require('express');
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
  res.send(`You sent: ${body.mibs}`)
})

// app.post('/sms', function (req, res) {
//   const body = req.body
//   res.set('Content-Type', 'text/plain')
//   res.send(`You sent: ${body.href} to Express`)
// })

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})