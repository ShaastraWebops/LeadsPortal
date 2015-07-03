/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Vertical = require('./vertical.model');

exports.register = function(socket) {
  Vertical.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Vertical.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('vertical:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('vertical:remove', doc);
}