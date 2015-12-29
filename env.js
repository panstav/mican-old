'use strict';

var log = require('./server/services/log');
var optional = require('optional');
var isOnline = require('is-online');

const env = optional('./env.json');

if (env){

	// mark that we have master keys
	process.env.MASTER_KEYS = 'true';

	// attach them to process.env
	for (let i in env) process.env[i] = env[i];

}

isOnline((err, is) => {
	if (err) return log.error(err);

	process.env.IS_ONLINE = is ? 'true' : undefined;
});