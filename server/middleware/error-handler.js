var log = require('../services/log');

module.exports = function(err, req, res, next){

	if (process.env.NODE_ENV === 'production' || process.env.DEBUG){
		log.error({ err: err, req: req }, 'Express Error Handler');
	}

	if (err.redirect) return res.status(500).redirect(err.redirect);

	if (err.status && err.statusText){
		if (process.env.NODE_ENV === 'test') return res.status(err.status).json(err);

		return res.status(err.status).end(err.statusText);
	}

	res.status(500).end();

};