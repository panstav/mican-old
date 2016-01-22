'use strict';

var log = require('./server/services/log');

require('./env.js');

let port = process.env.PORT || 3000;
require('./server')
	.init()
	.listen(port, () => log.info(`Server is up! Listening on ${port}.`));