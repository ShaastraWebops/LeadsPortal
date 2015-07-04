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
  Vertical.find({}, function (err, verticals) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(verticals);
  })
  .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider');
};

// Get a single vertical
exports.show = function(req, res) {
  Vertical.findById(req.params.id, function (err, verticals) {  
    if(err) { return handleError(res, err); }
    if(!vertical) { return res.sendStatus(404); }
    return res.json(vertical);
  })
  .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
  .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider');
};

// Creates a new vertical in the DB.
exports.create = function(req, res) {
  Vertical.create(req.body, function(err, vertical) {
  req.body.createdOn = Date.now();
  req.body.updatedOn = Date.now();
  req.body.createdBy = req.user._id;
  req.body.lastEditedBy = req.user._id;
    if(err) { return handleError(res, err); }
    return res.status(201).json(vertical);
  });
};

// Updates an existing vertical in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  req.body.updatedOn = Date.now();
  req.body.lastEditedBy = req.user._id;
  Vertical.findById(req.params.id, function (err, vertical) {
    if (err) { return handleError(res, err); }
    if(!vertical) { return res.sendStatus(404); }
    var updated = _.extend(vertical, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(vertical);
    });
  });
};

function handleError(res, err) {
  return res.status(500).json(err);
}