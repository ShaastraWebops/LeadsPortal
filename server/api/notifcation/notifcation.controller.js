'use strict';

var _ = require('lodash');
var Notifcation = require('./notifcation.model');

// Get list of notifcations
exports.index = function(req, res) {
  Notifcation.find(function (err, notifcations) {
    if(err) { return handleError(res, err); }
    return res.json(200, notifcations);
  });
};

// Get a single notifcation
exports.show = function(req, res) {
  Notifcation.findById(req.params.id, function (err, notifcation) {
    if(err) { return handleError(res, err); }
    if(!notifcation) { return res.send(404); }
    return res.json(notifcation);
  });
};

// Creates a new notifcation in the DB.
exports.create = function(req, res) {
  Notifcation.create(req.body, function(err, notifcation) {
    if(err) { return handleError(res, err); }
    return res.json(201, notifcation);
  });
};

// Updates an existing notifcation in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Notifcation.findById(req.params.id, function (err, notifcation) {
    if (err) { return handleError(res, err); }
    if(!notifcation) { return res.send(404); }
    var updated = _.merge(notifcation, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, notifcation);
    });
  });
};

// Deletes a notifcation from the DB.
exports.destroy = function(req, res) {
  Notifcation.findById(req.params.id, function (err, notifcation) {
    if(err) { return handleError(res, err); }
    if(!notifcation) { return res.send(404); }
    notifcation.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}