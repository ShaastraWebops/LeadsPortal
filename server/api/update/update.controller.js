'use strict';

var _ = require('lodash');
var Update = require('./update.model');

// Get list of updates
exports.index = function(req, res) {
  Update.find(function (err, updates) {
    if(err) { return handleError(res, err); }
    return res.json(200, updates);
  });
};

// Get a single update
exports.show = function(req, res) {
  Update.findById(req.params.id, function (err, update) {
    if(err) { return handleError(res, err); }
    if(!update) { return res.send(404); }
    return res.json(update);
  });
};

// Creates a new update in the DB.
exports.create = function(req, res) {
  Update.create(req.body, function(err, update) {
    if(err) { return handleError(res, err); }
    return res.json(201, update);
  });
};

// Updates an existing update in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Update.findById(req.params.id, function (err, update) {
    if (err) { return handleError(res, err); }
    if(!update) { return res.send(404); }
    var updated = _.merge(update, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, update);
    });
  });
};

// Deletes a update from the DB.
exports.destroy = function(req, res) {
  Update.findById(req.params.id, function (err, update) {
    if(err) { return handleError(res, err); }
    if(!update) { return res.send(404); }
    update.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}