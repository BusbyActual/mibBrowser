const mibs = require('./libsmiNew');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const CircularJSON = require('circular-json');
const cors = require('cors');

// var sails = require('sails');
// var multer  = require('multer');
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })
// var upload = multer({ storage: storage });
// const _ = require('underscore');
// const path = require('path');
// const upload = multer();

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// parse files
// app.use(require('skipper')());
app.use(cors());



app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/mibs', function (req, res) {
  const body = req.body
  body.mibs ? 1===1 : body.mibs = [];
  //if (body.mibs && Array.isArray(body.mibs)) {
    mibs.mibLoader(body.mibs)
  // }
  

  let data = mibs.getData();

  let children = mibs.buildTree(body.oid, data);


  // fs.writeFileSync('test.txt', CircularJSON.stringify(data))
  // res.send(`You sent: ${body.mibs} ` + JSON.stringify(data))

  res.send(JSON.stringify(children))
})

app.post('/children', function (req, res) {
  const body = req.body
  body.mibs ? 1===1 : body.mibs = [];

    mibs.mibLoader(body.mibs)

  

  let data = mibs.getData();
 
  let children = mibs.getChildren(body.oid, data);


  // fs.writeFileSync('test.txt', CircularJSON.stringify(data))
  // res.send(`You sent: ${body.mibs} ` + JSON.stringify(data))

  res.send(JSON.stringify(children))
})

app.post('/tree', function (req, res) {
  const body = req.body
  body.mibs ? 1===1 : body.mibs = [];
  mibs.mibLoader(body.mibs)

  

  let data = mibs.getData();
 
  let children = mibs.buildTree(data, body.oid);


  // fs.writeFileSync('test.txt', CircularJSON.stringify(data))
  // res.send(`You sent: ${body.mibs} ` + JSON.stringify(data))

  res.send(JSON.stringify(children))
})



// app.post('/upload', upload.array(), function(req, res, next) {
 

  //let data  = [{'Node':'rsRoot','address':'1.3.6.1.4.1.2566','SmiDecl':'SMI_DECL_MODULEIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':null,'Format':null,'children':[{'Node':'rsCommon','address':'1.3.6.1.4.1.2566.113','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for common object and event definitions','Format':null,'children':[],'size':8},{'Node':'rsProducts','address':'1.3.6.1.4.1.2566.127','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for products.','Format':null,'children':[{'Node':'rsProdBroadcast','address':'1.3.6.1.4.1.2566.127.1','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for broadcast products.','Format':null,'children':[{'Node':'rsProdBroadcastMeasurement','address':'1.3.6.1.4.1.2566.127.1.1','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for broadcast measurement products.','Format':null,'children':[],'size':10},{'Node':'rsProdBroadcastTransmitter','address':'1.3.6.1.4.1.2566.127.1.2','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for broadcast transmitter products.','Format':null,'children':[],'size':10},{'Node':'rsProdBroadcastHeadend','address':'1.3.6.1.4.1.2566.127.1.3','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for broadcast headend products.','Format':null,'children':[],'size':10}],'size':9},{'Node':'rsProdRadioCommunications','address':'1.3.6.1.4.1.2566.127.2','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for radio communication products.','Format':null,'children':[{'Node':'rsProdRadioCommCommon','address':'1.3.6.1.4.1.2566.127.2.1','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for radio communication product common features.','Format':null,'children':[],'size':10},{'Node':'rsProdRadioCommSeries4200','address':'1.3.6.1.4.1.2566.127.2.2','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for radio communication series 4200.','Format':null,'children':[],'size':10},{'Node':'rsProdRadioCommSystems','address':'1.3.6.1.4.1.2566.127.2.3','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for radio communication systems.','Format':null,'children':[],'size':10},{'Node':'rsProdRadioCommEquipment','address':'1.3.6.1.4.1.2566.127.2.4','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for radio communication equipment.','Format':null,'children':[],'size':10}],'size':9}],'size':8},{'Node':'rsRequirements','address':'1.3.6.1.4.1.2566.131','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for management application requirements','Format':null,'children':[],'size':8},{'Node':'rsExperimental','address':'1.3.6.1.4.1.2566.137','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for experimental definitions','Format':null,'children':[],'size':8},{'Node':'rsCapabilities','address':'1.3.6.1.4.1.2566.139','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for agent capabilities','Format':null,'children':[],'size':8},{'Node':'rsRegistration','address':'1.3.6.1.4.1.2566.149','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for registrations','Format':null,'children':[{'Node':'rsRegModules','address':'1.3.6.1.4.1.2566.149.1','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for modules registrations','Format':null,'children':[],'size':9},{'Node':'rsRegBroadcast','address':'1.3.6.1.4.1.2566.149.2','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Description.','Format':null,'children':[{'Node':'rsRegBroadcastMeasurement','address':'1.3.6.1.4.1.2566.149.2.1','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Description.','Format':null,'children':[],'size':10},{'Node':'rsRegBroadcastTransmitter','address':'1.3.6.1.4.1.2566.149.2.2','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Description.','Format':null,'children':[],'size':10}],'size':9}],'size':8},{'Node':'rsCrypto','address':'1.3.6.1.4.1.2566.151','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for crypto algorithms','Format':null,'children':[],'size':8}],'size':7}];
  // console.log(req.body);
 //  var uploader = req.file();
 //  var config = {
 //     dirname: require('path').resolve('C:\\Data\\Projects\\libsmi\\uploads')
 //   };

 //  uploader.upload(config, function (err, uploadedFiles) {
 //  	console.log(uploadedFiles,'$$$$')
	//   if (err) return res.send(500, err);
	//   return res.json({
	//     message: uploadedFiles.length + ' file(s) uploaded successfully!',
	//     files: uploadedFiles
	//   });
	// })

  //    storage(req, res, function (err) {
  //   if (err) {
  //     // An error occurred when uploading
  //     console.log(err)
  //     return
  //   }

  //   // Everything went fine
  //     console.log(req.body, '$$$');
  // })

// , function whenDone(err, uploadedFiles) {
//   if (err) return res.negotiate(err);
//   else return res.send({
//     files: uploadedFiles,
//     textParams: req.params
//   });
// }
// res.send(data);

// })

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})