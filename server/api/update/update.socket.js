/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Update = require('./update.model');

exports.register = function(socket) {
  Update.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Update.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('update:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('update:remove', doc);
}