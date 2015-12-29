var log = require('../services/log');

var urls = require('../helpers/urls');
var isFrontEndRoute = require('../helpers/is-front-end-route');

module.exports = function(req, res){

	var path = req.path;

	// respond with html page
	if (req.accepts('html')){

		var logObj = { path: req.path };
		logObj.userID = req.user ? req.user._id : null;

		return res.status(isFrontEndRoute(req.path) ? 200 : 404).sendFile('partials/index.html', { root: 'public', maxAge: 0 });
	}

	// respond with json
	if (req.accepts('json')){

		var status = 400;
		res.status(status).json({ error: 'Not found' });

		var eventObj = {
			ec: 'Routes', ea: 'Error', dl: path
		};

		return req.track.event(eventObj).send();
	}

};