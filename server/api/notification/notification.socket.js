/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Notifcation = require('./notification.model');

exports.register = function(socket) {
  Notifcation.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Notifcation.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('notification:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('notification:remove', doc);
}