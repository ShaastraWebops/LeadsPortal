/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Mailer = require('./mailer.model');

exports.register = function(socket) {
  Mailer.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Mailer.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('mailer:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('mailer:remove', doc);
}