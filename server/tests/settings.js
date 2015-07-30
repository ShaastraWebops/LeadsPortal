var settings = {};
settings.server ={
	domain:"http://localhost:9000"
} ;
settings.mongo = {
	host:"localhost:27017"
}
settings.dummycore1 = {
	email:"core1@core.com",
	password:"core"
}
settings.dummycoord2 = {
	email:"core2@core.com",
	password:"core"
}
settings.dummycoord1 = {
	email:"coord1@coord.com",
    password:"coord"
} 
settings.dummycoord2 ={
	email:"coord2@coord.com",
	password:"coord"
}
settings.dummycoord3 = {
	email:"coord3@coord.com",
    password:"coord"
}
exports.settings = settings;