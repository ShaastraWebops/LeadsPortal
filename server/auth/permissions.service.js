'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var Department = require('../api/department/department.model');
var SubDepartment = require('../api/subDepartment/subDepartment.model');

var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);

        user.lastSeen = Date.now();
        user.save(function(err) {
          if(err) return res.send(err);
        });
        req.user = user;
        next();
      });
    });
}

/**
 * Checks if the user role meets the requirements of the destination
 */

function hasRoleInDepartment() {
  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      console.log(req.user);
      if (req.user.department.indexOf(req.body.department) == -1) return res.send(403);
      next();
    });
}

function hasRoleInSubDepartment() {
  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      console.log(req.user);
      if (req.user.subDepartment.indexOf(req.body.subDepartment) == -1) return res.send(403);
      next();
    });
}


/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRoleInDepartment = hasRoleInDepartment;
exports.hasRoleInSubDepartment = hasRoleInSubDepartment;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;