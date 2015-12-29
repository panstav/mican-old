var log = require('../services/log');

module.exports = function(err, req, res, next){

	log.error({ err: err, req: req }, 'Express Error Handler');

	if (err.redirect) return res.status(500).redirect(err.redirect);

	res.status(500).end();

};