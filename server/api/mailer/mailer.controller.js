'use strict';

var _ = require('lodash');
var nodemailer=require('nodemailer');

var transporter=nodemailer.createTransport({
  service:'Gmail',
  auth:{
    user:'shaastra.iitmadras@gmail.com',
    pass:'shaastra@123'
  }
});


exports.sendMail=function(sendList, subj, message){ 
  transporter.sendMail({
                  from: 'shaastra.iitmadras@gmail.com',
                  to: sendList[0],
                  bcc:sendList.valueOf(),
                  subject: subj,
                  text: message
                },function(error,info){
                  if(error)
                    return console.log(error);
                  console.log(info);
                });
}

