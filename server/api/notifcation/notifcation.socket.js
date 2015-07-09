/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Notifcation = require('./notifcation.model');

exports.register = function(socket) {
  Notifcation.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Notifcation.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('notifcation:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('notifcation:remove', doc);
}