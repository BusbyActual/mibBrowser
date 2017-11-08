const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');


module.exports.register = (req, res) => {
  // let newUser = new User(req.body);
  // newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  // newUser.save((err, user) => {
  //   if (err) {
  //     return res.status(400).send({
  //       message: err
  //     });
  //   } else {
  //     user.hash_password = undefined;
  //     return res.json(user);
  //   }
  // });
  let headers = req.body.headers;

  console.log(headers);

  res.send(headers)
};

module.exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.status(401).json({ message: 'Authentication failed. User not found.' });
    } else if (user) {
      if (!user.comparePassword(req.body.password)) {
        res.status(401).json({ message: 'Authentication failed. Wrong password.' });
      } else {
        return res.json({token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id}, 'RESTFULAPIs')});
      }
    }
  });
};

module.exports.loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};

module.exports = module.exports;