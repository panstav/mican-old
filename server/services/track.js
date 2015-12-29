var _ = require('lodash');

var log = require('./log');

var UniversalAnalytics = require('universal-analytics');
var key = process.env.ANALYTICS_KEY;

// https everywhere and all that
// allow using mongoIDs as analyticsCid
var options = {
	https: process.env.SECURE ? 'https' : 'http',
	strictCidFormat: false
};

track.middleware = function(req, res, next){
	req.track = track(req.user);

	next();
};

module.exports = track;

function track(userReq){

	var visitor;

	// don't bother building service if we're not registering any data
	if (process.env.NODE_ENV !== 'production') return { page: uaLog, event: uaLog };

	// different calls for anon / user
	visitor = userReq
		? UniversalAnalytics(key, userReq._id.toString(), options)
		: UniversalAnalytics(key, options);

	// keep on reporting but also log data
	if (process.env.DEBUG) visitor = visitor.debug();

	return {
		page: visitor.pageview.bind(visitor),
		event: visitor.event.bind(visitor)
	};

	function uaLog(data){

		// log instead
		log.info(data, 'Analytics');

		// return send method because syntax
		return { send: _.noop };
	}

}