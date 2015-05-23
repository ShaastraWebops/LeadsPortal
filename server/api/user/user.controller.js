'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var nodemailer = require('nodemailer');
var smtpapi    = require('smtpapi');
var Department = require('../department/department.model');

var EMAIL = ''; // Put your fest mail id here
var PASSWORD = ''; // Put your fest password here 

var validationError = function (res, err) {
  return res.status(422).json(err);
};

function handleError(res, err) {
  return res.status(500).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
  User.find({}, '-salt -hashedPassword -lastSeen', function (err, users) {
    if(err) return res.json(500, err);
    res.status(200).json(users);
  })
  .populate('department', 'name');
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  console.log('asdasdasdasd');
  console.log(req.body);
  var newUser = new User(req.body);
  newUser.role = 'user';
  newUser.provider = 'local';
  newUser.createdOn = Date.now();
  newUser.updatedOn = Date.now();
  newUser.save(function (err, user) {
    if (err) { console.log(err); return validationError(res, err); }
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.sendStatus(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).json(err);
    return res.sendStatus(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  console.log(req.params);
  console.log(req.user._id);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function (err) {
        if (err) return validationError(res, err);
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(403);
    }
  });
};

/**
 * Updates a users profile details
 */
exports.updateProfile = function (req, res, next) {
  var userId = req.user._id;
  var userUpdate = req.body.userUpdate;

  // I'm no where using req.params.id here. Do a better algo
  User.findById(userId, function (err, user) {
    if(err) return validationError(res, err);
    if(!user) return res.sendStatus(404);
    user.name = userUpdate.name;
    user.city = userUpdate.city;
    user.summerLocation = userUpdate.summerLocation;
    user.cgpa = userUpdate.cgpa;
    user.phoneNumber = userUpdate.phoneNumber;
    user.hostel = userUpdate.hostel;
    user.updatedOn = Date.now();
    user.save(function (err) {
      if(err) return validationError(res, err);
      res.sendStatus(200);
    });
  });
};

/**
 * Get my info
 */
exports.me = function (req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.sendStatus(401);
    res.json(user);
  });
};

/**
 * Add any user to any department as a coord
 * @param {req.body.department} : Department ID
 * @param {req.body.user} : User ID
 * @param {Function} : User and Department IDs are sent 
 *                     in the body of the request.
 *                     Using that we see if user already exists in department
 *                     or if Department already exists in the user
 */
exports.addDepartment = function (req, res, next) {
  User.findById(req.body.user, function (err, user) {
    Department.findById(req.body.department, function (err, department) {
      if(err) { 
        return handleError(res, err);
      }
      if(!department) {
        return res.sendStatus(404);
      }
      if (department[req.body.role].indexOf(user._id) == -1){
        department[req.body.role].push(user._id);
        department.save(function (err) {
          if(err) { return handleError(res, err); }
        });
      }
      if(user.department.indexOf(department._id) == -1){
        user.department.push(req.body.department);
        user.updatedOn = Date.now();
        user.save(function (err) {
          if(err) { return handleError(res, err); }
          res.sendStatus(200); 
        });
      }
      else res.sendStatus(200);
    });
  });
};

/**
 * Add any user to a SubDepartment
 * @param {req.body.subDepartment}   req  SubDepartment ID
 * @param {req.body.user}   req  User ID
 * @param {Function} User and SubDepartment IDs are sent 
 *                   in the body of the request.
 *                   Using that we see if user already exists in subDepartment
 *                   or if SubDepartment already exists in the user
 */
exports.addSubDepartment = function(req, res, next) {
  User.findById(req.body.user, function (err, user) {
    SubDepartment.findById(req.body.subDepartment, function (err, subDepartment) {
      if(err) { 
        return handleError(res, err);
      }
      if(!subDepartment) {
        return res.sendStatus(404);
      }
      if (subDepartment[req.body.role].indexOf(user._id) == -1){
        subDepartment[req.body.role].push(user._id);
        subDepartment.save(function (err) {
          if(err) { return handleError(res, err); }
          if(user.subDepartment(subDepartment._id) == -1){
            user.subDepartment.push(req.body.subDepartment);
            user.updatedOn = Date.now();
            user.save(function (err) {
              if(err) { return handleError(res, err); }
              res.sendStatus(200); 
            });
          }
        });
      }
      else res.sendStatus(200);
    });
  });
};

/**
 * Sends a mail to the user to reset the password
 * 
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.sendResetMail = function(req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(25, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if(err) { return handleError(res, err); }
        if(!user) { return res.sendStatus(404); }
        
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // one hour

        user.save(function (err) {
          done(err, token, user);
        })
      })
    },
    function (token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: EMAIL,
          pass: PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: EMAIL,
        subject: 'Account Password Reset',
        text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/resetPassword/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err, info) {
        if(err) {
          console.log('Error Occurred');
          console.log(err);
          return res.sendStatus(500);
        } else {
          console.log(info);
          res.sendStatus(200);
        }
      });      
    }
  ], function (err) {
    if(err) { return next(err); }
    res.redirect('/forgotPassword');
  });
};

/**
 * Resets the password of the user
 * 
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.resetPassword = function(req, res) {
  console.log(req.params);
  console.log(req.body);
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { console.log('sdad'); return res.sendStatus(404); }
    user.password = req.body.newPassword;
    user.token = '';
    user.updatedOn = Date.now();
    user.save(function (err, user) {
      if(err) { return handleError(res, err); }

      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: EMAIL,
          pass: PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: EMAIL,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err, info) {
        if(err) {
          console.log('Error Occurred');
          console.log(err);
          return res.sendStatus(500);
        } else {
          console.log(info);
          res.sendStatus(200);
        }
      });      
    });
  });
};

/**
 * 
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
