const optional = require('optional');
const sfx = optional('sfx') || { pop: function(){} };

const log = require('./server/services/log');
const port = process.env.PORT || 3000;

require('./env.js');

require('./server')
	.init()
	.listen(port, () => {
		log.info(`Server is up! Listening on ${port}.`);
		sfx.pop();
	});