var extend = require('util')._extend;
var is = require('is_js');

var log = require('../services/log');
var validMongoID = require('../helpers/valid-mongo-id');

module.exports = function(options){

	options = options || {};

	function auth(req, res, next){

		//-=======================================================---
		//------------------ Auth Validation
		//-=======================================================---

		// not local, and doesn't have a req.user
		if (!req.user) return fail();

		// got users info - check for required roles
		if (req.user.blocked && req.user.blocked.value){
			if (!options.test) log.warn({ req: req }, 'User blocked');

			return fail();
		}

		// user is not blocked - check for confirmations required for request
		if (options.confirmed && !req.user.confirmed[options.confirmed].value) return fail();

		// user is affirmed - check if admin to skip other checks
		var isAdmin = is.inArray('admin', req.user.roles);
		if (isAdmin) return next();

		if (options.groupAdmin){

			if (!req.user.admining || !req.user.admining.length) return fail();

			var result = options.groupAdmin.match(/^(body|params):([\w\d]+)/);

			if (result && result.length){
				options.groupAdmin = req[result[1]][result[2]];
			}

			if (!validMongoID(options.groupAdmin)) return fail();

			if (!is.inArray(options.groupAdmin, req.user.admining)) return fail();
		}

		if (options.admin && !isAdmin) return fail();

		next();

		function fail(){

			if (options.test) return new Error('Failed auth');

			if (!options.possibleMishap){
				log.warn({ req: req }, 'Suspicious');
			}

			// probably http via ajax
			if (req.accepts('json')) return res.status(401).end();

			// simple http via address
			res.redirect(options.redirect || '/');
		}

	}

	auth.test = function(reqMock, resMock, callback){

		var req = extend((reqMock || {}), {
			accepts: function(){
				return false
			}
		});

		var res = extend((resMock || {}), {
			redirect: function(){
				new Error('Failed auth');
			}
		});

		auth(req, res, callback);

	};

	return auth;

};