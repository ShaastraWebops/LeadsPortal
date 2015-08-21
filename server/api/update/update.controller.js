'use strict';

var _ = require('lodash');
var Update = require('./update.model');
var Deal = require('../deal/deal.model');
var notifier = require('../notification/notification.controller');
var mailer = require('../mailer/mailer.controller');

// Get list of updates
exports.index = function(req, res) {
  Update.find(function (err, updates) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(updates);
  });
};

// Get a single update
exports.show = function (req, res) {
  Update.findById(req.params.id, function (err, update) {
    if(err) { return handleError(res, err); }
    if(!update) { return res.sendStatus(404); }
    return res.json(update);
  });
};

// Creates a new update in the DB.
exports.create = function (req, res) {
  req.body.createdBy = req.user._id;
  req.body.lastEditedBy = req.user._id;
  req.body.createdOn = Date.now();
  req.body.updatedOn = Date.now();

  Deal.findById(req.body.deal, function (err, deal) {
    if(err) { return handleError(res,err); }
    // checking if the deal is closed or not
    if(deal.status === false) {   
      if(deal.assignees.indexOf(req.user._id) != -1 || req.user.role === 'core' || req.user.role === 'admin') {
        Update.create(req.body, function (err, update) {
          if(err) { return handleError(res, err); }
          deal.updates.push(update._id);
          deal.save(function (err, dealfin) {
            if(err) { return handleError(res, err); }
            update
              .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
              .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider', function (err, up) {
                return res.status(201).json(up);
              });
            notifier.notifyDeal(deal.assignees, req.user, deal, ' has posted an update to deal - ', function () {
              var info = req.user.name + ' has posted an update to deal - ' + deal.title;
              mailer.sendMail(deal.assignees, '[Shaastra16-LeadsPortal] New update added to deal - ' + deal.title, info);
            });
          });
        });
      }
      else
        return res.sendStatus(403);
    } else { 
      res.sendStatus(403);
    }
  });
};

// Updates an existing update in the DB.
exports.update = function (req, res) { 
  req.body.updatedOn = Date.now();
  req.body.lastEditedBy = req.user._id;
  if(req.body._id) { delete req.body._id; }
  Update.findById(req.params.id, function (err, update) {
    if (err) { return handleError(res, err); }
    if(!update) { return res.sendStatus(404); }
    Deal.findById(update.deal, function (err, deal) {
      if (err) { return handleError(res, err); }
      if(!deal) { return res.sendStatus(404); }
      // checking if the deal is closed or not
      if(deal.status === false) { 
        if(req.user.role === 'core' || req.user.role === 'admin' || 
          (req.user.role === 'coord' && deal.assignees.indexOf(req.user._id)>-1)) {
            var updated = _.merge(update, req.body);
            updated.save(function (err) {
              if (err) { return handleError(res, err); }
              updated
                .populate('createdBy', '-salt -hashedPassword -lastSeen -provider')
                .populate('lastEditedBy', '-salt -hashedPassword -lastSeen -provider', function (err, up) {
                  return res.status(200).json(up);
                });
              notifier.notifyDeal(deal.assignees, req.user, deal, ' has edited an update to deal - ', function () {
                var info = req.user.name + ' has edited an update to deal - ' + deal.title;
                mailer.sendMail(deal.assignees, '[Shaastra16-LeadsPortal] Update edited - ' + deal.title, info);
            });  
          });
        } else
            res.sendStatus(403);
      } else { 
        res.sendStatus(403);
      }
    });
  });
};

// Deletes a update from the DB.
exports.destroy = function(req, res) {
  Update.findById(req.params.id, function (err, update) {
    if(err) { return handleError(res, err); }
    if(!update) { return res.sendStatus(404); }
    update.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.sendStatus(204);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
