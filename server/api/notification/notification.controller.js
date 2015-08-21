'use strict';

var _ = require('lodash');
var Notifcation = require('./notification.model');
var User = require('../user/user.model');

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
  Notifcation.create(req.body, function (err, notifcation) {
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
    if(!notifcation) { return res.sendStatus(404); }
    notifcation.remove(function (err) {
      if(err) { return handleError(res, err); }
      return res.sendStatus(204);
    });
  });
};

function handleError(res, err) {
  return res.status(500).json(err);
}

exports.notifyDeal = function(assignees, updatedBy, deal, message, callback) {
  var notif = new Notifcation();
  notif.info = updatedBy.name + message + deal.title;
  notif.deal = deal._id;
  notif.save(function (err) {
    if(err) { console.log(err); }
    else {
      var len = assignees.length;
      var sendTo = [];
      //console.log(updatedBy);
      //console.log(updatedBy._id.toString());
      for(var i=0; i<len; i++) {
      	//console.log(assignees[i].toString());
      	if(assignees[i].toString() === updatedBy._id.toString())
      		continue;
        User.findById(assignees[i], function (err, user) {
          if(err) { console.log('Error'); }
          if(!user) { console.log('No user'); }
          if(user) {
            user.notifications.push(notif._id);
            user.save(function (err) {
              if(err) { console.log(err); }
            });
          }
        });
      }
    }
    callback();
  });  
};

exports.deleteNotifs = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  User.findById(req.user._id, function (err, user) {
    if(err) { return handleError(res, err); }
    console.log(user);
    if(!user) { return res.sendStatus(404); }
    var newNotifs = _.difference(user.notifications, req.body.notifs);
    user.notifications = newNotifs;
    user.save(function (err) {
      if(err) { return handleError(res, err); }
      return res.sendStatus(201);
    });
  });
};