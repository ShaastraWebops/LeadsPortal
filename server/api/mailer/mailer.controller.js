'use strict';

var _ = require('lodash');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'EMAILID',
    pass: 'PASSWORD'
  }
});


exports.sendMail = function (sendList, subj, message) { 
  transporter.sendMail({
    from: 'EMAILID',
    bcc: sendList.valueOf(),
    subject: subj,
    text: message
  }, function (error, info) {
    if(error)
      return console.log(error);
    console.log(info);
  });
}

