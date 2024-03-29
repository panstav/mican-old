var log = require('../services/log');

var urls = require('../helpers/urls');
var isFrontEndRoute = require('../helpers/is-front-end-route');

module.exports = function(req, res){

	// respond with html page
	if (req.accepts('html')){
		const angularState = isFrontEndRoute(req.path);

		res.status(angularState ? 200 : 404).sendFile('partials/index.html', { root: 'public', maxAge: 0 });

		if (!angularState) return req.track({ cat: '404', label: 'http', path: req.path });

		return;
	}

	// respond with json
	if (req.accepts('json')){
		res.status(400).json({ error: 'Not found' });

		return req.track({ cat: '404', label: 'json' });
	}

	res.status(404).end();

	req.track({ cat: '404', label: 'unknown' });
};