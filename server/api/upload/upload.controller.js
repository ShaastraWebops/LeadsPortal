'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  Grid = require('gridfs-stream'),
  mime = require('mime');

Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);

exports.create = function (req, res) {
  var part = req.files.file;
  if(part.mimetype != "application/zip"){
    res.send({
      message: 'Please upload zip files only'
    })
  }
  else{
    var writeStream = gfs.createWriteStream({
      filename: part.name,
      mode: 'w',
      content_type:part.mimetype
    });


    writeStream.on('close', function(file) {
      return res.status(200).send({
        fileId: file._id,
        message: 'Success'
      });
    });
    
    writeStream.write(part.data);

    writeStream.end();
  }
}

exports.serve = function(req, res) {
  gfs.findOne({ _id: req.params.id}, function (err, file) {
      if(!file){
        return res.status(400).send({
          message: 'File not found'
        });
      }
  
    res.writeHead(200, {'Content-Type': file.contentType});
    
    var readstream = gfs.createReadStream({
        filename: file.filename
    });
 
      readstream.on('data', function(data) {
          res.write(data);
      });
      
      readstream.on('end', function() {
          res.end();        
      });
 
    readstream.on('error', function (err) {
      console.log('An error occurred!', err);
      throw err;
    });
  });
}

exports.destroy = function (req, res) {
  gfs.remove({_id: req.params.id}, function (err) {
    if (err) return handleError(err);
    res.status(200).send({
      message: 'Success',
    });
  });  
};

// exports.create = function(req, res) {
//   var form = new multiparty.Form(
//     {uploadDir: __dirname + '/static'}
//   );

//   form.parse(req, function(err, fields, files) {
//     console.log(fields);
//     console.log(files);
//     console.log(err);
//     res.json(200, files);
//   });
// };

function handleError(res, err) {
  return res.send(500, err);
}
