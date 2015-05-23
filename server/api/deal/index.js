'use strict';

var express = require('express');
var controller = require('./deal.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('coord'), controller.index);
router.get('/:id', auth.hasRole('coord'), controller.show);
router.get('/myDeals', auth.hasRole('coord'), controller.myDeals);

router.post('/', auth.hasRole('coord'), controller.create);

router.put('/:id', auth.hasRole('coord'), controller.update);
router.patch('/:id', auth.hasRole('coord'), controller.update);
router.delete('/:id', auth.hasRole('coord'), controller.destroy);

module.exports = router;