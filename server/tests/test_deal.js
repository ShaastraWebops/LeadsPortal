var settings = require('./settings');
var mongoose = require("mongoose");
var settings = require("./settings").settings;
var http = require("http");
var should = require("should");
var assert = require("assert");
var request = require('request');
var _ = require("underscore");
var Q = require("q");
var db = mongoose.connection;
var qstring = require('querystring');
var models = {};
var dummycore1 = "";
var dummycoord1 = "";
models.deal = require('../api/deal/deal.model');
models.department = require('../api/department/department.model');
models.notifcation = require('../api/notifcation/notifcation.model');
models.subDepartment = require('../api/subDepartment/subDepartment.model');
models.update = require('../api/update/update.model');
models.user = require('../api/user/user.model');
models.vertical = require('../api/vertical/vertical.model');
db.open('mongodb://'+settings.mongo.host);
var core1_login = {
	email:'core1@core.com',
	password:'core'
};
var coord1_login = {
	email:'coord1@coord.com',
	password:'coord'
};
var get_req = function(path,token){
	debugger;
var options={
    host: 'localhost',
    port: 9000,
    path : path,
    headers: {
     'Authorization': 'Bearer ' + token
   }
 }
 http.get(options,function(err,res){
   console.log(err);
 	debugger;
 	return res;
 })
};
describe("logging in ",function(done){
	it("as core1",function(done){
    	request.post({
		uri:settings.server.domain+"/auth/local",
		headers:{'content-type': 'application/x-www-form-urlencoded'},
		body:qstring.stringify(core1_login)
	},function(err,res,body){
        console.log(err);
		body = JSON.parse(body);
		console.log(body);
    debugger;
		dummycore1 = body.token;
		debugger;
		should.exist(body);
		console.log(dummycore1);
		done();
	});
	})
	it("as coord1",function(done){
    	request.post({
		uri:settings.server.domain+"/auth/local",
		headers:{'content-type': 'application/x-www-form-urlencoded'},
		body:qstring.stringify(coord1_login)
	},function(err,res,body){
        console.log(err);
		body = JSON.parse(body);
		console.log(body);
		debugger;
		dummycoord1 = body.token;
		should.exist(body.token);
		console.log(dummycoord1	);
		done();
	});
	})
	describe("checking /api/deals/ url",function(done){
	it("it should return all deals for coord",function(done){
		debugger;
      console.log(get_req('/api/deals',dummycoord1));
      done();
	})
	it("it should return all deals for the core",function(done){
		console.log(get_req('api/deals',dummycore1));
		done();
	})
})
});

