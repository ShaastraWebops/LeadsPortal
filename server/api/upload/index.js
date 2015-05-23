'use strict';

var express = require('express');
var controller = require('./upload.controller');

var router = express.Router();


router.get('/:id', controller.serve);
router.post('/', controller.create);
router.delete('/:id', controller.destroy);

module.exports = router;