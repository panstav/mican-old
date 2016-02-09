'use strict';

var Keen = require('keen-js');
var _ = require('lodash');

var log = require('./log');

var keenClient = new Keen({
	projectId: process.env.KEEN_PROJECT_ID,
	writeKey: process.env.KEEN_WRITE_KEY,
	protocol: "https"
});

track.middleware = middleware;

module.exports = track;

function middleware(req, res, next){
	req.track = track(req.user, _.pick(req, ['method', 'url', 'params', 'query', 'headers' ]));

	next();
}

function track(userReq, serializedReq){

	// don't bother building service if we're not registering any data
	if (process.env.NODE_ENV !== 'production') return data => { log.debug(data, 'Track') };

	return keen.bind(null, _.extend({ userID: userReq ? userReq._id.toString() : 'anon' }, serializedReq));

	function keen(user, event){

		// extract collection name and remove it from archived data
		let collectionName = event.cat;
		delete event.cat;

		// register event
		keenClient.addEvent(collectionName, _.extend(user, event), err => { if (err) log.error(err) });
	}

}