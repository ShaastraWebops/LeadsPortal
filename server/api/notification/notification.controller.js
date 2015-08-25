'use strict';

var _ = require('lodash');
var Notification = require('./notification.model');
var User = require('../user/user.model');
var mongoose = require('mongoose');

//Error handling
var validationError = function (res, err) {
  return res.status(422).json(err);
};

function handleError (res, err) {
  return res.status(500).json(err);
};

// Get list of notifications
exports.index = function(req, res) {
  Notification.find(function (err, notifications) {
    if(err) { return handleError(res, err); }
    return res.json(200, notifications);
  });
};

// Get a single notification
exports.show = function(req, res) {
  Notification.findById(req.params.id, function (err, notification) {
    if(err) { return handleError(res, err); }
    if(!notification) { return res.send(404); }
    return res.json(notification);
  });
};

// Creates a new notification in the DB.
exports.create = function(req, res) {
  Notification.create(req.body, function (err, notification) {
    if(err) { return handleError(res, err); }
    return res.json(201, notification);
  });
};

// Updates an existing notification in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Notification.findById(req.params.id, function (err, notification) {
    if (err) { return handleError(res, err); }
    if(!notification) { return res.send(404); }
    var updated = _.merge(notification, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, notification);
    });
  });
};

// Deletes a notification from the DB.
exports.destroy = function(req, res) {
  Notification.findById(req.params.id, function (err, notification) {
    if(err) { return handleError(res, err); }
    if(!notification) { return res.sendStatus(404); }
    notification.remove(function (err) {
      if(err) { return handleError(res, err); }
      return res.sendStatus(204);
    });
  });
};

function handleError(res, err) {
  return res.status(500).json(err);
}

exports.notifyDeal = function(assignees, updatedBy, deal, message, callback) {
  var notif = new Notification();
  notif.info = updatedBy.name + message + deal.title;
  notif.deal = deal._id;
  notif.save(function (err) {
    if(err) { console.log(err); }
    else {
      var len = assignees.length;
      for(var i=0; i<len; i++) {
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

exports.myNotifs = function(req, res) {
  Notification.find({ _id: { "$in" : req.user.notifications } }, function (err, notifs) {
    if(err) { return handleError(res, err); }
    if(notifs.length === 0) { return res.sendStatus(404); }
    return res.status(200).json(notifs);
  });
};
