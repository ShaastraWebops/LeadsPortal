/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var SubDepartment = require('./subDepartment.model');

exports.register = function(socket) {
  SubDepartment.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  SubDepartment.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('subDepartment:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('subDepartment:remove', doc);
}