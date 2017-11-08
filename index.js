
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const circularJSON = require('circular-json');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken-refresh');
const mibs = require('./libsmi');

const ENV = process.env.APP_ENV ? process.env.APP_ENV : 'development'; process.env.APP_ENV = 'development';
const config = require('./config.js');
const port = config[ENV].port;
const userRoutes = require('./src/routes/userRoutes');
const User = require('./src/models/userModel');
const secret = config[ENV].secret;
const tokenExpireTime = config[ENV].tokenExpireTime;



// const sails = require('sails');
const multer  = require('multer');
const _ = require('underscore');
const path = require('path');
// const upload = multer();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
const upload = multer({ storage: storage });






const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/* cannot locate libsmi error? */
var multipart = require('./scripts/connect-multiparty.js');

// var multipart = require('connect-multiparty');

app.use(multipart({
  uploadDir: '/Data/Projects/SLSCloudControls/mibHub/uploads'
}));

// parse files
app.use(require('skipper')());
app.use(cors());


app.post('/authenticate', (req, res) => {
  let headers = req.headers;

  if (headers['password'] === 'NFB-Consulting') {
    let token = jwt.sign({ data: headers['password'] }, secret, {
      expiresIn: tokenExpireTime
    });
    
    res.send({ token: 'JWT ' + token });
  }

})

app.use((req, res, next) => {

  if (req.headers && req.headers.authorization) {
    let token = req.body.token || req.query.token || (req.headers.auth ? req.headers.auth.split(' ')[1] : '') || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : '');

    jwt.verify(token, secret, {}, (err, decoded) => {      
      if (err) {

        /* refresh token if expired */
        if (err.name === 'TokenExpiredError') {
          let decoded = jwt.decode(token, {complete: true});
          let refreshed = jwt.refresh(decoded, tokenExpireTime, secret);

          req.token = refreshed;
          req.headers.authorization = 'JWT ' + refreshed;
          next();
        } else {
          return res.json({ success: false, message: 'Failed to authenticate token.' });  
        }
      } else {
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    return res.status(403).send({ 
      success: false, 
      message: 'No token provided.' 
    });

  }
})

// userRoutes(app);
app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.post('/mibs', (req, res) => {
  const body = req.body;
  body.mibs ? 1===1 : body.mibs = [];
  body.oid ? 1===1 : body.oid = '1';
  mibs.mibLoader(body.mibs);
  
  

  let data = mibs.getData();
  let children = mibs.buildTree(body.oid, data);


  // fs.writeFileSync('test.txt', CircularJSON.stringify(data))
  // res.send(`You sent: ${body.mibs} ` + JSON.stringify(data))

  res.send(JSON.stringify(children));
})

app.post('/children', (req, res) => {
  const body = req.body;
  body.mibs ? 1===1 : body.mibs = [];
  body.oid ? 1===1 : body.oid = '1';
  mibs.mibLoader(body.mibs);

  

  let data = mibs.getData();
  let children = mibs.getChildren(body.oid, data);


  // fs.writeFileSync('test.txt', CircularJSON.stringify(data))
  // res.send(`You sent: ${body.mibs} ` + JSON.stringify(data))

  res.send(JSON.stringify(children));
})

app.post('/tree', (req, res) => {
  const body = req.body;
  body.mibs ? 1===1 : body.mibs = [];
  mibs.mibLoader(body.mibs);

  

  let data = mibs.getData();
  let children = mibs.buildTree(data, body.oid);


  // fs.writeFileSync('test.txt', CircularJSON.stringify(data))
  // res.send(`You sent: ${body.mibs} ` + JSON.stringify(data))

  res.send(JSON.stringify(children));
})



app.post('/upload', function(req, res, next) {




// var data = _.pick(req.body, 'type')
//     , uploadPath = path.normalize('/uploads')
//     , file = req.files.file;

//   console.log(file.name); 
//   console.log(file.path); 
//   console.log(uploadPath); 

  res.send('uploaded successfully');

 //  let data  = [{'Node':'rsRoot','address':'1.3.6.1.4.1.2566','SmiDecl':'SMI_DECL_MODULEIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':null,'Format':null,'children':[{'Node':'rsCommon','address':'1.3.6.1.4.1.2566.113','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for common object and event definitions','Format':null,'children':[],'size':8},{'Node':'rsProducts','address':'1.3.6.1.4.1.2566.127','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for products.','Format':null,'children':[{'Node':'rsProdBroadcast','address':'1.3.6.1.4.1.2566.127.1','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for broadcast products.','Format':null,'children':[{'Node':'rsProdBroadcastMeasurement','address':'1.3.6.1.4.1.2566.127.1.1','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for broadcast measurement products.','Format':null,'children':[],'size':10},{'Node':'rsProdBroadcastTransmitter','address':'1.3.6.1.4.1.2566.127.1.2','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for broadcast transmitter products.','Format':null,'children':[],'size':10},{'Node':'rsProdBroadcastHeadend','address':'1.3.6.1.4.1.2566.127.1.3','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for broadcast headend products.','Format':null,'children':[],'size':10}],'size':9},{'Node':'rsProdRadioCommunications','address':'1.3.6.1.4.1.2566.127.2','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for radio communication products.','Format':null,'children':[{'Node':'rsProdRadioCommCommon','address':'1.3.6.1.4.1.2566.127.2.1','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for radio communication product common features.','Format':null,'children':[],'size':10},{'Node':'rsProdRadioCommSeries4200','address':'1.3.6.1.4.1.2566.127.2.2','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for radio communication series 4200.','Format':null,'children':[],'size':10},{'Node':'rsProdRadioCommSystems','address':'1.3.6.1.4.1.2566.127.2.3','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for radio communication systems.','Format':null,'children':[],'size':10},{'Node':'rsProdRadioCommEquipment','address':'1.3.6.1.4.1.2566.127.2.4','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for radio communication equipment.','Format':null,'children':[],'size':10}],'size':9}],'size':8},{'Node':'rsRequirements','address':'1.3.6.1.4.1.2566.131','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for management application requirements','Format':null,'children':[],'size':8},{'Node':'rsExperimental','address':'1.3.6.1.4.1.2566.137','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for experimental definitions','Format':null,'children':[],'size':8},{'Node':'rsCapabilities','address':'1.3.6.1.4.1.2566.139','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for agent capabilities','Format':null,'children':[],'size':8},{'Node':'rsRegistration','address':'1.3.6.1.4.1.2566.149','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for registrations','Format':null,'children':[{'Node':'rsRegModules','address':'1.3.6.1.4.1.2566.149.1','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for modules registrations','Format':null,'children':[],'size':9},{'Node':'rsRegBroadcast','address':'1.3.6.1.4.1.2566.149.2','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Description.','Format':null,'children':[{'Node':'rsRegBroadcastMeasurement','address':'1.3.6.1.4.1.2566.149.2.1','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Description.','Format':null,'children':[],'size':10},{'Node':'rsRegBroadcastTransmitter','address':'1.3.6.1.4.1.2566.149.2.2','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Description.','Format':null,'children':[],'size':10}],'size':9}],'size':8},{'Node':'rsCrypto','address':'1.3.6.1.4.1.2566.151','SmiDecl':'SMI_DECL_OBJECTIDENTITY','SmiAccess':'SMI_ACCESS_UNKNOWN','SmiStatus':'SMI_STATUS_CURRENT','SmiNodekind':'SMI_NODEKIND_NODE','Description':'Sub-tree for crypto algorithms','Format':null,'children':[],'size':8}],'size':7}];
 //  console.log(req.body);
 //  var uploader = req.file('file');
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
  //   req.file('file').upload(config, function (err, uploadedFiles) {
  //   if (err) return res.serverError(err);

  //   console.log(uploadedFiles);
  //   res.ok(uploadedFiles);
  // });

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

})

// app.post('/uploadTwo', function (req, res) {

//   var config = {
//     dirname: require('path').resolve(sails.config.appPath, 'files')
//   };

//   req.file('file').upload(config, function (err, uploadedFiles) {
//     if (err) return res.serverError(err);

//     console.log(uploadedFiles);
//     res.ok(uploadedFiles);
//   });
// });

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
})