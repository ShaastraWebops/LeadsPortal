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
  Vertical.populate(doc, {path:'title'}, {path:'description'}, function(err, vertical) {
  socket.emit('vertical:save', vertical);
}

function onRemove(socket, doc, cb) {
  socket.emit('vertical:remove', doc);
}