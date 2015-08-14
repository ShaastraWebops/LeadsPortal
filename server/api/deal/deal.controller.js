'use strict';

var _ = require('lodash');
var underscore = require('underscore');
var deepPopulate = require('mongoose-deep-populate');
var Deal = require('./deal.model');
var User = require('../user/user.model');
var Vertical = require('../vertical/vertical.model');
var notifier = require('../notification/notification.controller');
var mongoose=require('mongoose');
var mailer=require('../mailer/mailer.controller');

//Error handling
var validationError = function (res, err) {
  return res.status(422).json(err);
};

function handleError (res, err) {
  return res.status(500).json(err);
};

// Get list of deals
exports.index = function(req, res) {
  Deal.find()
  // .populate('updates')
  // .deepPopulate('updates.createdBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('assignees', '-salt -hashedPassword -lastSeen -provider')
  .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('vertical')
  .exec(function (err, deals) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(deals);
  });
};

// Gets all deals assigned to a particular coordinator/core
exports.myDeals = function(req, res) {
  Deal.find({ assignees: { "$in" : [req.user._id]} })
  .populate('assignees', '-salt -hashedPassword -lastSeen -provider')
  .deepPopulate('updates.createdBy updates.lastEditedBy')
  .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('vertical')
  .exec(function (err, deals) {
    if(err) { return handleError(res, err); }
    if(!deals) { return res.sendStatus(404); }
    return res.json(deals);
  });    
};

// Get a single deal
exports.show = function(req, res) {
  Deal.findById(req.params.id)
  .populate('assignees', '-salt -hashedPassword -lastSeen -provider')
  .deepPopulate('updates.createdBy updates.lastEditedBy')
  .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('vertical')
  .exec(function (err, deal) {
    if(err) { return handleError(res, err); }
    if(!deal) { return res.sendStatus(404); }
    return res.json(deal);
  });  
};

// Creates a new deal in the DB.
exports.create = function(req, res) {
  req.body.createdOn = Date.now();
  req.body.updatedOn = Date.now();
  req.body.createdBy = req.user._id;
  req.body.lastEditedBy = req.user._id;
  req.body.assignees = underscore.uniq(req.body.assignees);
  User.count({ '_id' : { $in : req.body.assignees } }, function (err, count) {
    if(err) { return handleError(res, err); }
    if(count != req.body.assignees.length) { res.sendStatus(400); }
    Vertical.findById(req.body.vertical, function (err, vertical) {
      if(err) { return handleError(res, err); }
      if(!vertical) { return res.sendStatus(404); }
        Deal.create(req.body, function (err, deal) {
          if (err) { return handleError(res, err); }
          else {
            notifier.notifyDeal(deal.assignees, req.user, deal, ' has assigned you to a deal - ', function() {
              console.log("notified");
              mailer.sendMail(deal.assignees, '[Shaastra16-LeadsPortal] New Deal created-'+deal.title, ' has assigned you to a deal - ');
        
            });
          }
        });
    });
  });
};

// Updates an existing deal in the DB.
exports.update = function(req, res) {
  req.body.updatedOn = Date.now();
  req.body.lastEditedBy = req.user._id;
  if(req.body._id) { delete req.body._id; }
  Deal.findById(req.params.id, function (err, deal) {
    if (err) { return handleError(res, err); }
    if(!deal) { return res.sendStatus(404); }
    // checking if the deal is closed or not
    if(deal.status === false) {  
      req.body.assignees = underscore.uniq(req.body.assignees);
      User.count({ '_id' : { $in : req.body.assignees } }, function (err, count) {
        if(err) { return handleError(res, err); }
        if(count != req.body.assignees.length) { res.sendStatus(400); }

        // if user logged in is coord, he should not be able to un-assign or assign people for that deal
        if(req.user.role === 'coord') { req.body.assignees = deal.assignees; }

        if(req.user.role === 'core' || req.user.role === 'admin' || 
          (req.user.role === 'coord' && deal.assignees.indexOf(req.user._id)>-1)) {      
          Vertical.findById(req.body.vertical, function (err, vertical) {
            if(err) { return handleError(res, err); }
            if(!vertical) { return res.sendStatus(404); }

            //Converting mongoose objectIds to string so that lodash can process it
            var i,request_assignees=[],initial_assignees=[];
            for(i=0;i<req.body.assignees.length;i++)
              request_assignees.push(req.body.assignees[i].toString());
            
            for(i=0;i<deal.assignees.length;i++)
              initial_assignees.push(deal.assignees[i].toString());

            // checking for change of assignees before updating
            var newAssignees_str = _.difference(request_assignees, initial_assignees);
            var newAssignees=[];

            //reconverting strings to mongoose objectIds
            for(i=0;i<newAssignees_str.length;i++)
              newAssignees.push(mongoose.Types.ObjectId(newAssignees_str[i]));

            var updatedDeal = _.extend(deal, req.body);
            updatedDeal.save(function (err) {
              if (err) { return handleError(res, err); }
              // to populate the deal wile saving to send it to client side
              updatedDeal
                .populate('updates')
                .populate('assignees')
                .populate('vertical')
                .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
                .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider', function (err, upde) {
                  return res.status(200).json(upde);
                });
              if(newAssignees.length!=0)
              {   notifier.notifyDeal(newAssignees, req.user, deal, ' has assigned you to a deal - ', function() {
                  console.log('notified');
                  mailer.sendMail(newAssignees, '[Shaastra16-LeadsPortal]New assignee added to deal - '+deal.title, notif.info);
                });
              } 
              else{
                   notifier.notifyDeal(req.body.assignees,req.user,deal,' has edited the deal - ',function(){
                   console.log('notified');
                   mailer.sendMail(deal.assignees, '[Shaastra16-LeadsPortal] Deal edited - '+deal.title, ' has edited the deal - ');
                  });
              }                
            });
          });
        } else { 
          res.sendStatus(403);
        }
      });
    } else {
      res.sendStatus(403);
    } 
  });
};

// Closes a deal from the DB
exports.closeDeal = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Deal.findById(req.params.id, function (err, deal) {
    if(err) { return handleError(res, err); }
    if(!deal) { return res.sendStatus(404); }

    if(req.user.role === 'core' || req.user.role === 'admin' || 
      (req.user.role === 'coord' && deal.assignees.indexOf(req.user._id)>-1)) {  
        deal.updatedOn = Date.now();
        deal.lastEditedBy = req.user._id;
        deal.status = true;
        deal.result = req.body.result;
        deal.comment = req.body.comment;

        deal.save(function (err) {
          if (err) { return handleError(res, err); }
          deal
            .populate('updates')
            .populate('assignees')
            .populate('vertical')
            .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
            .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider', function (err, upde) {
              return res.status(200).json(upde);
            });
          notifier.notifyDeal(deal.assignees,req.user,deal,' has closed the deal - ',function(){
            console.log('notified');
            mailer.sendMail(deal.assignees, '[Shaastra16-LeadsPortal] Deal closed - '+deal.title, ' has closed the deal - ');
          })

        });
    } else { 
      res.sendStatus(403);
    }
  });
};

// Re-opens a deal from the DB
exports.openDeal = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Deal.findById(req.params.id, function (err, deal) {
    if(err) { return handleError(res, err); }
    if(!deal) { return res.sendStatus(404); } 

   // checking if the deal is closed or not
   if(deal.status === true) {  
    if(req.user.role === 'core' || req.user.role === 'admin' || 
      (req.user.role === 'coord' && deal.assignees.indexOf(req.user._id)>-1)) {  
        deal.updatedOn = Date.now();
        deal.lastEditedBy = req.user._id;
        deal.status = false;
        deal.result = false;

        deal.save(function (err) {
          if (err) { return handleError(res, err); }
          deal
            .populate('updates')
            .populate('assignees')
            .populate('vertical')
            .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
            .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider', function (err, upde) {
              return res.status(200).json(upde);
            });
          notifier.notifyDeal(deal.assignees,req.user,deal,' has re-opened the deal - ',function(){
            console.log('notified');
            mailer.sendMail(deal.assignees, '[Shaastra16-LeadsPortal] Deal re-opened - '+ deal.title, ' has re-opened the deal - ');
          });            
        });
      } else { 
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(400);
    } 
  });
};

// Deletes a deal from the DB.
exports.destroy = function(req, res) {
  Deal.findById(req.params.id, function (err, deal) {
    if(err) { return handleError(res, err); }
    if(!deal) { return res.sendStatus(404); }
    deal.remove(function (err) {
      if(err) { return handleError(res, err); }
      return res.sendStatus(204);
    });
  });
};