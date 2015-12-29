var bunyan = require('bunyan');

var bunyanOptions = {
	name: 'Mican',
	level: process.env.TRACE ? 'trace' : (process.env.DEBUG ? 'debug' : 'info'),
	src: process.env.SHOW_SRC,
	serializers: bunyan.stdSerializers
};

var log = bunyan.createLogger(bunyanOptions);

log.reqTracer = function reqTracer(req, res, next){
	if (process.env.USERAGENTS) log.info(req.headers['user-agent'], 'Useragent');

	log.trace({ req: req, body: req.body }, 'Request Trace');

	next();
};

module.exports = log;