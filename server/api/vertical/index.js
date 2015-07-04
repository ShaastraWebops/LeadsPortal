'use strict';

var express = require('express');
var controller = require('./vertical.controller');
var auth = require('../../auth/auth.service');


var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('core'), controller.create);
router.put('/:id', auth.hasRole('core'), controller.update);
router.patch('/:id', auth.hasRole('core'), controller.update);

module.exports = router;