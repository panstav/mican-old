'use strict';

var log = require('./server/services/log');
var optional = require('optional');
var isOnline = require('is-online');

var env = optional('./env.json');

if (env){

	// attach them to process.env
	for (let i in env) process.env[i] = env[i];

}

isOnline((err, is) => {
	if (err) return log.error(err);

	process.env.IS_ONLINE = is ? 'true' : undefined;
});

module.exports = env;