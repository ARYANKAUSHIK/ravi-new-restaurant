var config = require('../config/dev');
var Client = require('node-rest-client').Client;
var client = new Client();

module.exports.csrf = function csrf(req, res, next){
	res.locals.token = req.csrfToken();
	next();
};

module.exports.authenticated = function authenticated(req, res, next){
	req.session.isAuthenticated = req.session.isAuthenticated ? true : false;
	res.locals.isAuthenticated = req.session.isAuthenticated;
	if (req.session.isAuthenticated) {
		res.locals.user = req.session.user;
	}
	next();
};

module.exports.requireAuthentication = function requireAuthentication(req, res, next){
	if (req.session.isAuthenticated) {
		next();
	}else {
		req.session.oldUrl = req.url;
		req.session.oldData = req.body;
		res.redirect('/');
	}
};

module.exports.auth = function auth(mobile, password, session, callback){
	var args = {
      data: { mobile: parseInt(mobile), password: password, apiKey:  config.api.key},
      headers: { "Content-Type": "application/json" }
  	};
	var req = client.post(config.api.serverUrl+ "/login", args, function (data, response) {
	console.log("data "+ data);
	if (data && data.success == true){
		console.log("data "+ data);
		session.isAuthenticated = true;
			session.user = data;
			console.log(" >>> ", response);
			callback(null, data);
	}else{
		callback({error:'me'}, null);
	}
	});
};

module.exports.logOut = function logOut(session){
	session.isAuthenticated = false;
	delete session.user;
};

module.exports.query = function query(req, res, next){
	res.locals.query = req.query;
	next();
};

module.exports.templateRoutes = function templateRoutes(req, res, next){
	res.locals.routes = config.routes;
	next();
};

module.exports.templateApi = function templateApi(req, res, next){
	res.locals.api = config.api;
	next();
};

module.exports.defaults = function defaults(req, res, next){
	res.locals.defaults = config.defaults;
	next();
};
