var _ = require('lodash');

var db = require('../../server/services/db');

var Express =   require('express');
var enrouten =  require('express-enrouten');
var bodyParser = require('body-parser');

var requester = require('./requester');
var track = require('../../server/services/track');
var fourofour = require('../../server/middleware/four-o-four');

db.init();

var agents = {};
var agentNames = ['admin', 'user', 'justID', 'anon', 'bare'];
var expresses = {};

_.each(agentNames, newExpressForName);
_.forIn(expresses, includeMiddleware);

expresses.admin.use(require('../../server/localID'));
expresses.admin.use(isAdminMethod);

expresses.user.use(assignRandomUser);

expresses.justID.use(justIDAsUser);

_.forIn(expresses, attachRoutesAndPrepForExport);

module.exports = agents;

function includeMiddleware(expressInstance){
	expressInstance.use(bodyParser.json());
	expressInstance.use(bodyParser.urlencoded({ extended: true }));
	expressInstance.use(track.middleware);
	expressInstance.use(require('../../server/middleware/snapshooter'));
}

function newExpressForName(name){
	expresses[name] = new Express();
}

function isAdminMethod(req, res, next){
	req.user.roles = ['admin'];
	req.user.isAdmin = function(){ return true };

	next();
}

function assignRandomUser(req, res, next){

	db.models.user.findOneRandom(function(err, randomUserDoc){
		if (err) return next(err);

		req.user = randomUserDoc.toObject();

		next();
	});

}

function justIDAsUser(req, res, next){
	req.user = { id: '54a31351487fb20300fbbcb2' };

	next();
}

function attachRoutesAndPrepForExport(expressInstance, name){

	expressInstance.use(enrouten({ directory: '../../server/routes' }));
	expressInstance.use(fourofour);

	agents[name] = requester(expressInstance);

}