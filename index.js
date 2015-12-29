'use strict';

require('./env.js');

let port = process.env.PORT || 3000;
require('./server')
	.init()
	.listen(port, () => console.log(`Server is up! Listening on ${port}.`));