'use strict';

var _ = require('lodash');
var Vertical = require('./vertical.model');
var underscore = require('underscore');
var deepPopulate = require('mongoose-deep-populate');
var User = require('../user/user.model');

//Error handling
var validationError = function (res, err) {
  return res.status(422).json(err);
};

function handleError (res, err) {
  return res.status(500).json(err);
};

// Get list of verticals
exports.index = function(req, res) {
  Vertical.find() 
  .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider')
  .exec(function (err, verticals) {
    if(err) { return handleError(res, err); }
    return res.json(200, verticals);
  });
};

// Get a single vertical
exports.show = function(req, res) {
  Vertical.findById(req.params.id, function (err, verticals) {  
    if(err) { return handleError(res, err); }
    if(!vertical) { return res.send(404); }
    return res.json(vertical);
  })
  .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider');
  console.log();
};

// Creates a new vertical in the DB.
exports.create = function(req, res) {
  Vertical.create(req.body, function(err, vertical) {
  req.body.createdOn = Date.now();
  req.body.updatedOn = Date.now();
  req.body.createdBy = req.user._id;
  req.body.lastEditedBy = req.user._id;
    if(err) { return handleError(res, err); }
    return res.json(201, vertical);
  });
};

// Updates an existing vertical in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Vertical.findById(req.params.id, function (err, vertical) {
    if (err) { return handleError(res, err); }
    if(!vertical) { return res.send(404); }
    var updated = _.merge(vertical, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, vertical);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}