'use strict';

var _ = require('lodash');
var underscore = require('underscore');
var deepPopulate = require('mongoose-deep-populate');
var Deal = require('./deal.model');
var User = require('../user/user.model');

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
  .populate('assignees', '-salt -hashedPassword -lastSeen -provider')
  .populate('updates')
  .deepPopulate('updates.createdBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider')
  .exec(function (err, deals) {
    if(err) { return handleError(res, err); }
    return res.json(200, deals);
  });
};

// Gets all deals assigned to a particular coordinator/core
exports.myDeals = function(req, res) {
  Deal.find({ assignees: { "$in" : [req.user._id]} })
  .populate('assignees', '-salt -hashedPassword -lastSeen -provider')
  .deepPopulate('updates.createdBy updates.lastEditedBy')
  .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider')
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
    Deal.create(req.body, function (err, deal) {
      if (err) { return handleError(res, err); }
      return res.json(201, deal);
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

    req.body.assignees = underscore.uniq(req.body.assignees);
    User.count({ '_id' : { $in : req.body.assignees } }, function (err, count) {
      if(err) { return handleError(res, err); }
      if(count != req.body.assignees.length) { res.sendStatus(400); }

      // if user logged in is coord, he should not be able to un-assign or assign people for that deal
      if(req.user.role === 'coord') { req.body.assignees = deal.assignees; }

      if(req.user.role === 'core' || req.user.role === 'admin' || 
        (req.user.role === 'coord' && deal.assignees.indexOf(req.user._id)>-1)) {      
        var updatedDeal = _.extend(deal, req.body);
        updatedDeal.save(function (err) {
          if (err) { return handleError(res, err); }
          return res.json(200, deal);
        });
      } else { 
        res.sendStatus(403);
      }
    });
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